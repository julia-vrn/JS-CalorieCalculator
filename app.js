//Storage Controller

//Item Controller
const ItemCtrl = (function(){
 //Item Constructor
 const Item = function(id, name, calories){
   this.id = id;
   this.name = name;
   this.calories = calories;
 }

 //Data Structure / State
 const data = {
   items: [
     /*{id: 0, name: 'Steak Dinner', calories: 1200},
     {id: 1, name: 'Cookie', calories: 400},
     {id: 2, name: 'Eggs', calories: 300}, //hard-coded data*/
   ],
   currentItem: null,
   totalCalories: 0
 }

 //Public methods
 return {
   getItems: function(){
    return data.items;
   },
 
   logData: function(){    
     return data;
   },
   addItem: function(name, calories){
     let ID;
     //Create ID
     if(data.items.length > 0){
       ID = data.items[data.items.length-1].id + 1;

     }else {
       ID = 0;
     }
     //Parse calories to number
     calories = parseInt(calories);
     //Create new item
     newItem = new Item(ID, name, calories);
     //add to items array
     data.items.push(newItem);
     return newItem;
   },
   getItemById: function(id){
     let found = null;
     //Loop through items
     data.items.forEach(function(item){
       if(item.id === id){
         found = item;
       }

     });
     return found;
   },
   setCurrentItem: function(item){
      data.currentItem = item;
   },
   getCurrentItem: function(){
     return data.currentItem;

   },
   getTotalCalories: function(){
     let total = 0;
     //Loop through items and add cals
     data.items.forEach(function(item){
       total += item.calories;
     });
     // Set total cal in data structure
     data.totalCalories = total;
     //Return total
     return data.totalCalories;
   }
 }
})();

//UI Controller
const UICtrl = (function(){

  //UI element variables
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
  }

  //Public methods
  return {
    //display records
    populateItemList: function(items){
      let html = '';
      items.forEach(function(item) {
        html += `<li class="collection-item" id="${item.id}"><strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
      </li>`;
      });

      //insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    addListItem: function(newItem){
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //create li element
      const li = document.createElement('li');
      //add class
      li.className = 'collection-item';
      //Add ID
      li.id = `item-${newItem.id}`;

      //add HTML
      li.innerHTML = `<strong>${newItem.name}: </strong> <em>${newItem.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`;
      //Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);

    },
    getSelectors: function(){
      return UISelectors;
    },
    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },
    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;

    },
    clearEditState: function(){
      UICtrl.clearInput();
      //Hide update/delete buttons by default
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },
    showEditState: function(){
      //show and hide buttons on edit
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    }
  }

})();

//App Controller
const App = (function(ItemCtrl, UICtrl){
  // Load event listeners
  const loadEventListeners = function(){
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();
    //add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);
  }

  //Add item submit
  const itemAddSubmit = function(e){
    //get form input from UI Controller
    const input = UICtrl.getItemInput();
    //check for name and calorie input
    if(input.name !=='' && input.calories !==''){
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      //get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      //Clear fields
      UICtrl.clearInput();
    }
    
    e.preventDefault();
  }

  //Update item submit
  const itemEditClick= function(e){
    //target edit icon
    if(e.target.classList.contains('edit-item')){
      //item to edit to currentItem variable
      //get list item id
      const listId = e.target.parentNode.parentNode.id;
      console.log(listId);


      //break into an array item-0 to ['item'-, 0]
      const listIdArr = listId.split('-');
      console.log(listIdArr);
      //get the actual id
      const id = parseInt(listIdArr[1]);

      //get item
      const itemToEdit = ItemCtrl.getItemById(id);
      console.log(itemToEdit);
      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add item to form
      UICtrl.addItemToForm();
    
    }
    
    e.preventDefault();
  }

  //Public methods
  return {
    init: function(){
      //Clear set initial state (hide buttons)
      UICtrl.clearEditState();
      //Fetch items from data structure
      const items = ItemCtrl.getItems();
      //Check of any items
      if(items.length === 0){
        UICtrl.hideList();
      } else {
         //Populate list with items
        UICtrl.populateItemList(items);
      }
       //get total calories
       const totalCalories = ItemCtrl.getTotalCalories();
       //Add total calories to UI
       UICtrl.showTotalCalories(totalCalories);      
      //load event listeners
      loadEventListeners();
    }
  }

})(ItemCtrl, UICtrl);

//Initialize App
App.init();
