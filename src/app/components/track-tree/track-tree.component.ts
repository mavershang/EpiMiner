import {Component, Injectable} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlattener, MatTreeFlatDataSource} from '@angular/material/tree';
import {of as ofObservable, Observable, BehaviorSubject} from 'rxjs';
import { GetDataService } from 'src/app/services/get-data.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';


/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  path: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
  'Reminders': [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ],
  // 'Groceries': {
  //   'Organic eggs': null,
  //   'Protein Powder': null,
  //   'Almond Meal flour': null,
  //   'Fruits': {
  //     'Apple': null,
  //     'Orange': null,
  //     'Berries': ['Blueberry', 'Raspberry']
  //   }
  // }
  
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange: BehaviorSubject<TodoItemNode[]> = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private dataService: GetDataService) {


    this.initialize();
  }

  // initialize() {
  //   // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
  //   //     file node as children.
  //   const data = this.buildFileTree(TREE_DATA, 0);


  //   // Notify the change.
  //   this.dataChange.next(data);
  // }

  initialize() {
    let trackTreeData: any;
    this.dataService.getTrackTree().subscribe(
      data => {
        const trackTreeData = this.buildFileTree(data, 0, "");
        this.dataChange.next(trackTreeData);
      }, error => {
        console.log ("Failed to get track file structure: " + error.message);
      });
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(value: any, level: number, path: string) {
    let data: any[] = [];
    let delim = '/';
    for (let k in value) {
      let v = value[k];
      let node = new TodoItemNode();
      node.item = `${k}`;
      node.path = path + delim + node.item 
      if (v === null || v === undefined) {
        // no action
      } else if (typeof v === 'object') {
        node.children = this.buildFileTree(v, level + 1, node.path);
      } else {
        node.item = v;
        node.path = path + delim + node.item 
      }
      data.push(node);
    }
    return data;
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    const child = <TodoItemNode>{item: name};
    if (parent.children) {
      parent.children.push(child);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
  }
}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'app-track-tree',
  templateUrl: './track-tree.component.html',
  styleUrls: ['./track-tree.component.css'],
  providers: [ChecklistDatabase]
})
export class TrackTreeComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap: Map<TodoItemFlatNode, TodoItemNode> = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap: Map<TodoItemNode, TodoItemFlatNode> = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName: string = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private database: ChecklistDatabase,
              private dataService: GetDataService) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  getLevel = (node: TodoItemFlatNode) => { return node.level; };

  isExpandable = (node: TodoItemFlatNode) => { return node.expandable; };

  getChildren = (node: TodoItemNode): Observable<TodoItemNode[]> => {
    return ofObservable(node.children);
  }

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.expandable; };

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => { return _nodeData.item === ''; };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    let flatNode = this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node)!.item === node.item
      ? this.nestedNodeMap.get(node)!
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child => this.checklistSelection.isSelected(child));
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
  }

  /** Select the category so we can insert the new item. */
  addNewItem(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this.database.insertItem(parentNode!, '');
    this.treeControl.expand(node);
  }

  /** Save the node to database */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    this.database.updateItem(nestedNode!, itemValue);
  }

  //#region Open EpiGenome Browser with url parameters
  openEpiBrowser() {
    // verify track selection 
    //let  node = this.checklistSelection.selected[1];
    const trackPaths=[];
    for (let i=0; i< this.checklistSelection.selected.length; i++) {
      let path2 = this.flatNodeMap.get(this.checklistSelection.selected[i]).path;
      trackPaths.push(path2);
    }

    this.dataService.getEGHubFileV2(trackPaths).subscribe(
      data => { 
        let hubJsonUrl = data.Value;
        let coordinate = "";
        
        // build URL
        let eg_url = this.buildEGUrl(coordinate, hubJsonUrl);
        window.open(eg_url, '_blank');  

      }, error =>{
        console.log(error);
      }
    )

    // // generate data hub file
    // this.getDataService.getEGHubFile(this.selectedTrackTypes, this.selectedTrackDataSources, this.selectedTrackTissues).subscribe(
    //   data =>{
    //     let hubJsonUrl = data.Value;

    //     // get coordinate
    //     let coordinate = '';

    //     if (this.activeTab == this.tabOptions[0]){
    //       coordinate = this.getCoordinate(this.lastIdx);
    //     }
    //     else if (this.activeTab = this.tabOptions[1]) {
    //       coordinate = this.getCoordinate2(this.lastIdx2);
    //     }

    //     if (coordinate == null)
    //     {
    //       this.openDialog("Please select a SNP from the table");
    //       return;
    //     }

    //     // build URL
    //     let eg_url = this.buildEGUrl(coordinate, hubJsonUrl);
    //     window.open(eg_url, '_blank');                          
    //   }, error => {
    //     this.openDialog("Failed to generate data hub for epigenome browser: " + error.message);
    //   }
    // )

    
  }

  buildEGUrl(position:string, hubUrl:string) {
    if (position === "") {
      return "http://10.132.10.11:3000/browser?genome=hg19"  + "&hub=" + hubUrl;
    } 
    else {
      let arr = position.split("-");
      if (arr.length == 1)
      {
        arr = position.split(":");
        let pos = parseInt(arr[1]);
        position = arr[0] + ":" + (pos - 100000) + "-" + (pos + 100000);
      }
      return "http://10.132.10.11:3000/browser?genome=hg19" + "&position=" + position + "&hub=" + hubUrl;
    }
  }

  //#endregion

}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */