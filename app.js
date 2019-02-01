
//FIXME: BUDGET CONTROLLER
var budgetController = (function(){

    //create function Constructor Expense and Income

    var Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    };

    var Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    };

    var totalExenses = 0;
   
    //don't forget, this is still private
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    };

    return {
        addItem: function(type, des, val){
            var newItem, ID;

            //create new iD
            if(data.allItems[type].length > 0){
                // [exp][inc]
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            // create new item based on type
            if(type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID, des, val);
            }

            //push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    }
})();


//FIXME: UI CONTROLLER
var UIController = (function(){

    //we store it to var DOMstring, so if we want to change name at index.html, we can always change here
    var DOMstrings = { 
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };

    return { //here we connect to index.html, for typing
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,  //will be inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //for convert string to number, so we can calculate number
            };
        },

        addListItem: function(obj, type){

            var html, newHtml, element;

            //create HTML string with placeholder text
            if(type === 'inc'){
                
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp'){
                
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            var fields, fieldsArray;

            //simple: fields selecting element list html, but we want to try list into array. so we use Array function construct (Array.prototype), then 'Slice' return selected element as a new Array. and use 'call' for calling 'fields' which content are element. So fields(fieldsArray) is now an Array

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function(current, index, array){
                //The current variable stores the <input> element. To read a value of value attribute of this element we're using value property.then "" is to empty string
                current.value = ""; 
            });

            fieldsArray[0].focus();

            /* we can just use this easier method, but that above method is to show how to work with Nodelist into array
            document.querySelector(DOMstrings.inputDescription).value = "";
            document.querySelector(DOMstrings.inputValue).value = "";
            document.querySelector(DOMstrings.inputDescription).focus();
            */
        },

        getDOMstrings: function(){
            return DOMstrings; //for tell that DOMstrings is public. so it can be accessed
        }
    };

})();



//FIXME: GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListener = function(){

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
    
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });
    };


    var updateBudget = function(){
        
        //1. Calculate the budget 



        //2. return bduget

        //2. display budget to UI
    }

    var ctrlAddItem = function(){

        var input, newItem;

        //1. Get the filed input data
        input = UICtrl.getInput();

        if(input.description !==  "" && !isNaN(input.value) && input.value > 0){
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); //this use var input as argument(type des val), because in the function addItem that same argument

            //3. add the item to UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. calculate and update budget
            updateBudget();
            
        }else{
            alert('Hmm.. Something went wrong!\n 1. Description is missing\n2. Value must above 0 or not empty')
        }
    };

    return {
        init: function(){
            console.log('TEST STARTED');
            setupEventListener();
        }
    };

})(budgetController, UIController);


controller.init(); //this init will be first run then run setupEventListener