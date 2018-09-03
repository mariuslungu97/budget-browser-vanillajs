// var currentAppState = {
//     incomeList : [],
//     expenseList : [],
//     total : 0
// }

var budgetController = (function() {
    
    var Income = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Expense = function (id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        }
    }

    return {
        addItem : function(type, des, val) {
            //init newItem and ID variables
            var newItem,ID;
            //assign ID to the ID of the last added element + 1 if there are any ID's in the arrays
            if(data.allItems[type].length > 0) ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            //else assign the initial ID to 0
            else ID = 0;

            if(type === 'inc') {
                newItem = new Income(ID,des,val);
            } else {
                newItem = new Expense(ID,des,val);
            }
            //add the newly created item to its corresponding array
            data.allItems[type].push(newItem);

            return newItem;
        },

        testing : function() {
            console.log(data);
        }
    }
})();

var UIController = (function() {

    var uiMarkup = {
        addInputButton : '.add__btn',
        descriptionBox : '.add__description',
        valueBox : '.add__value',
        inputType : '.add__type',
        redFocus : 'red-focus',
        budgetValue : '.budget__value',
        incomeValue : '.budget__income--value',
        expenseValue : '.budget__expenses--value',
        expensePercentage : '.budget__expenses--percentage',
        incomeList : '.income__list',
        expenseList : '.expenses__list'
    };
   
    
    return {
        getDOMStrings : function() {
            return uiMarkup;
        },
        getInput : function() {
            return {
                 description : document.querySelector(uiMarkup.descriptionBox).value,
                 value : document.querySelector(uiMarkup.valueBox).value,
                 inputType : document.querySelector(uiMarkup.inputType).value
            }
              
        },

        addListItem : function(obj, type) {
            var html,newHtml,element;

            if(type === 'inc') {
                element = uiMarkup.incomeList;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = uiMarkup.expenseList;
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },
        
        changeInputColor : function(type) {
            if(type === 'exp') {
                document.querySelector(uiMarkup.descriptionBox).classList.add(uiMarkup.redFocus);
                document.querySelector(uiMarkup.valueBox).classList.add(uiMarkup.redFocus);
                document.querySelector(uiMarkup.inputType).classList.add(uiMarkup.redFocus);
                document.querySelector(uiMarkup.addInputButton).style.color = '#FF5049';
            } else if(type === 'inc') {
                document.querySelector(uiMarkup.descriptionBox).classList.remove(uiMarkup.redFocus);
                document.querySelector(uiMarkup.valueBox).classList.remove(uiMarkup.redFocus);
                document.querySelector(uiMarkup.inputType).classList.remove(uiMarkup.redFocus);
                document.querySelector(uiMarkup.addInputButton).style.color = '#28B9B5';
            }
        }
        
    }
})();


//We could have also used the budgetController and UIController variables directly in the app controller
//but this would make the other controllers a little bit less independent
//Ex : if you would change the name of the budgetController into something else, you would have needed to change it
//all around the appController.
var appController = (function(budgetCtrl,UICtrl) {
    
    var setupEventListeners = function() {
        //Local variable for the UI Markup
        var markup = UICtrl.getDOMStrings();
        //Add Button Event Handler
        document.querySelector(markup.addInputButton).addEventListener('click',function() {
            ctrlAddItem();
        });

        //Add Enter Event Handler
        document.addEventListener('keypress',function(event) {
            //If the keyCode is the Enter keycode ( Noted : keyCode is deprecated)
            //the which section is for older browsers
            if(event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })

        //Input Type Event Handler 
        document.querySelector(markup.inputType).addEventListener('change',function() {
            UICtrl.changeInputColor(UICtrl.getInput().inputType);
        });
    }
   
    var ctrlAddItem = function() {
        // 1. Get Input
        var input = UICtrl.getInput();
        // 2. Read the input, check if the inputs has values and add the item to the budget controller
        if(input.description && input.value) {
            var newItem = budgetCtrl.addItem(input.inputType,input.description,input.value);

            UICtrl.addListItem(newItem,input.inputType);
        }
        // 3. Add a new item to the user interface

        // 3. Calculate and update the budget

        // 4. Display the budget

        // 5. Clear Input for the next input     
        
        
    };

    return {
        init : function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }

})(budgetController,UIController);

appController.init();