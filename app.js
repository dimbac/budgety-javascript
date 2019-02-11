
//FIXME: BUDGET CONTROLLER
var budgetController = (function(){

    //create function Constructor Expense and Income

    var Expense = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value,
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        //this is just calculate Method
        if(totalIncome > 0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        //because we use function Construct Expense, so getPercentage will get the result calcPercentage which this.percentage that stored
        return this.percentage;
    };

    var Income = function(id, description, value){
        this.id = id,
        this.description = description,
        this.value = value
    };

    var calculateTotal= function(type){
        //this is for calculate the total
        var sum = 0; //initial value

        //looping from array (ex: exp, inc)
        data.allItems[type].forEach(function(cur){ 
            //ex: [200, 400], sum = 0 + 200 
            //then sum = 200 + 400 = 600, etc
            sum += cur.value; 
        });
        data.totals[type] = sum;
    };
   
    //TODO: don't forget, this is still private
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1 // it mean doesn't exit at this point
    };

    return {   //remember, return = exposes it to public, can be accessed anywhere
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

        deleteItem: function(type, id){

            var ids, index;

            //map is actually return as brand new array
            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            // simple: The indexOf() method searches the array for the specified item, and returns its position.
            // so ids is new array > indexOf()is search the array for the 'id' > stores into var index
            index = ids.indexOf(id);

            //remember sPlice = remove element, while slice = create a copy
            //splice (index positiion to add/remove, howmanyremoved)
            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }

            /* 
            //we can use this forEach method
            data.allItems[type].forEach(function(cur, index) {
                if (cur.id === ID) {
                data.allItems[type].splice(index, 1);
                }
            });
            */
        },

        calculateBudget: function(){
            // calculate total income and expense
                calculateTotal('exp');
                calculateTotal('inc');

            //calculate the budget: income - expense, then stores it into data.budget
            data.budget =  data.totals.inc - data.totals.exp; 

            //calculate the percentage of income that we spent, then stores it into data.percentage
            if(data.totals.inc > 0){  //if total inc greater than 0, then it can use percentage method
                data.percentage =  Math.round((data.totals.exp / data.totals.inc) * 100);
            }else{
                data.percentage = -1;//doesn't exist
            }
        },

        calculatePercentages: function(totalIncome){

            //first we must call and loop the array exp in order to use calcPercentage()
            data.allItems.exp.forEach(function(cur){ 
                cur.calcPercentage(data.totals.inc); //then use 'cur' to call/use calcPercentage() for calculate the total inc array
            });
        },

        getPercentages: function(){
            //basically return the result calculatePercentage() using map as new brand array then stores it into var 'allPerc'
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function(){ //for return the result from calculateBudget
            
            //we must create new function for return multiple value calculateBudget, so we can return four or more values at same time, then pass it into displayBudget()
            //remember, return = exposes it to public, can be accessed anywhere
            return{ 
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type){
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2); //ex: 2345.4578 to 2345.46

        numSplit = num.split('.'); // split between '.' then into as array

        //then stores it into var
        int = numSplit[0];
        
        if(int.length > 3){ //if more than 3, ex: 2345 then add a coma
            // start at position zero and read one number, it would read 2 from 2345
        /*
            int = int.substr(0, 1) + ',' + int.substr(1, 3); 
            //but this hardcoded because if input 23455, then 2,3455
        */

        int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        //if input 23455 and length is 5, start at position zero and read 5-3=2, it read number two
        //then add comas, and start at position two which (int.length-3), and read until end 

        }

        dec = numSplit[1];

        //type === 'exp' ? sign = '-' : sign = '+';

        return (type === 'exp' ? '-' : '+') + int + '.' + dec;

    };

    //the nodeListForEach function is basically replicating the operation of the regular forEach method. 
    //So when we call this function, 'list' has the variable 'fields', and 'callback'  has the anonymous function
    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++){
            //list[i]  is passed into the parameter 'current' , and 'i' is passed into the parameter 'index'
            callback(list[i], i); 
        }
    };  

    return { //remember, return = exposes it to public, can be accessed anywhere

        getInput: function(){ //here we connect to index.html, for user typing
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

                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if(type === 'exp'){
                
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            //replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            //insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function(selectorID){ //'selectorID' just a parameter placeholder name, will called from ctrlDeleteItem
            var el ;
            
            el = document.getElementById(selectorID);

            //This method applies on a DOM Element, so if we want to remove an element, we FIRST need to access its parent element, THEN from it, remove its child
            //simple: select parent using parentNode then removeChild, in that argument we select 'el' to removed
            el.parentNode.removeChild(el)
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

        displayBudget: function(obj){

            //this is for display the result getBudget by selecting DOMstring text content
            //btw, this obj is placeholder to mimic getting the 'real' data which var budget (from getBudget())
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

            if(obj.percentage > 0){
            //simple:  obj.percentage is not 0 but greater than 0, then display number with percentage sign
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{ 
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function(percentages){
            //querySelectorAll return a nodeList
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); 

            nodeListForEach(fields, function(current, index){
                if(percentages[index] > 0){
                    current.textContent = percentages[index] + '%';
                }else{
                    current.textContent = '---';
                }
            });

            /* we can just use this simple forEach, that above is just a way to use 'for var'
              
                var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);    
                Array.prototype.forEach.call(fields, function (current, index) {
                    if (percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else {
                        current.textContent = '---';
                    }
                });
            */

        },

        displayMonth: function(){
            var now, months, month, year;

            now = new Date(); // function Construct Date, simply call Date then stores into var now

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            month = now.getMonth();
            year = now.getFullYear();//its gonna return this year

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },


        changedType: function(){

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' + 
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);

            nodeListForEach(fields, function(cur){
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

        },

        getDOMstrings: function(){
            //remember, return = exposes it to public, can be accessed anywhere
            return DOMstrings;
        }
    };

})();



//FIXME: GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

    //for user use keyboar
    var setupEventListener = function(){

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event){
    
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        //we select container because it contain income and expense, then let event 'ctrlDeleteItem bubbling which the target is ID
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };


    var updateBudget = function(){
        
        //1. Calculate the budget 
        budgetCtrl.calculateBudget();

        //2. return budget
        //then stores getBudget(which return the result) into var budget, so we can call var budget
        var budget = budgetCtrl.getBudget(); 
        
        //2. display budget to UI
        // then call var budget in argument. replace function displayBudget (obj) to (budget)
        UICtrl.displayBudget(budget);

        //so we can call function updateBudget which calculate > return > display
    };

    var updatePercentage = function(){

        //1. calculate percentage
        budgetCtrl.calculatePercentages();

        //2. read percentage from the budget controller
        var percentages = budgetCtrl.getPercentages(); //getPercentage then stores it into var 'percentages'

        //3. update the UI with the new percentage
        UICtrl.displayPercentages(percentages);

    };

    var ctrlAddItem = function(){

        var input, newItem;

        //1. Get the filed input data
        input = UICtrl.getInput();

        if(input.description !==  "" && !isNaN(input.value) && input.value > 0){

            //2. Add the item to the budget controller
            //this use var input as argument(type des val), because in the function addItem that same argument
            newItem = budgetCtrl.addItem(input.type, input.description, input.value); 

            //3. add the item to UI
            UICtrl.addListItem(newItem, input.type);

            //4. Clear the fields
            UICtrl.clearFields();

            //5. calculate and update budget
            updateBudget();

            //6. calculate and update percentage
            updatePercentage();

        }else{
            alert('Hmm.. Something went wrong!\n 1. Description is missing\n2. Value must above 0 or not empty')
        }

        //so we can call function ctrlAddItem which  input, addlistItem, clearfields, updateBudget, 
    };

    /*event is simply a variable name that we use as the argument in the callback function. We could call this anything we like,However, it is standard practice to call this argument 'event'  or 'e' , so that it's clear what type of variable will be used here. This is because the event  argument will receive an object from the addEventListener method that is an instance of the Event prototype. */

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        //console.log(itemID);

        /* if we happen to have other ids, we can do the if statement as:
            if(itemID.search("income")){
                //code
            } */

        if(itemID){
            /*basically broke which '-' into different part. ex: Pulling output = 'inc-1' > then split into ('inc', '1') as array*/

            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]); //because that a string, cannot compare with number, so we must convert string into number using parseInt

            //1. delete the item from the data structure
            var deletedItem = budgetCtrl.deleteItem(type, ID);
            console.log(deletedItem + ' deleted');//testing purpose

            //2. delete the item from the UI
            UICtrl.deleteListItem(itemID);

            //3. update and show the new budget
            updateBudget();

            //4. calculate and update percentage
            updatePercentage();
        }

    };

    return {
        //reset everything into 0
        init: function(){
            console.log('APPLICATION HAS STARTED');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListener();
        }
    };

})(budgetController, UIController);

//this init will be first run then run setupEventListener
controller.init(); 