

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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(current) {
            sum += current.value;
        })
        data.totals[type] = sum;
    }
    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        },
        budget : 0,
        percentage : -1
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

        calculateBudget : function() {
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.totals.inc > 0) data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            else data.percentage = -1;
        },

        getBudget : function() {
            return {
                totals : {
                    inc : data.totals.inc,
                    exp : data.totals.exp,

                },
                budget : data.budget,
                percentage : data.percentage
            }
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
                 value : parseFloat(document.querySelector(uiMarkup.valueBox).value),
                 inputType : document.querySelector(uiMarkup.inputType).value
            }
              
        },

        clearInput : function() {
            var inputArray = Array.prototype.slice.call(document.querySelectorAll(uiMarkup.descriptionBox + ', ' + uiMarkup.budgetValue));

            inputArray.forEach(function(item) {
                item.value = '';
            });

            document.querySelector(uiMarkup.descriptionBox).focus();
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
            var fields = document.querySelectorAll(uiMarkup.descriptionBox + ', ' + uiMarkup.valueBox + ', ' + uiMarkup.inputType + ', ' + uiMarkup.addInputButton);
            var fieldsArr = Array.prototype.slice.call(fields);
            if(type === 'exp') {
                fieldsArr.forEach(function(current) {
                    current.classList.add(uiMarkup.redFocus);
                    fieldsArr[3].style.color = '#FF5049';
                });
            } else if(type === 'inc') {
                fieldsArr.forEach(function(current) {
                    current.classList.remove(uiMarkup.redFocus);
                    fieldsArr[3].style.color = '#28B9B5';
                });
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
   
    var calculateBudget = function() {
        // 6. Calculate and update the budget
        budgetController.calculateBudget();
        // 7. Return the budget
        var budgets = budgetController.getBudget();
        console.log(budgets);
        // 7. Display the budget

    };
    
    var ctrlAddItem = function() {
        // 1. Get Input
        var input = UICtrl.getInput();
        // 2. Read the input, check if the inputs has values
        if(input.description && input.value && input.value > 0) {
            // 3. add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.inputType,input.description,input.value);
            // 4. Add a new item to the user interface
            UICtrl.addListItem(newItem,input.inputType);
            // 5. Clear Input for the next input     
            UICtrl.clearInput();
            
            calculateBudget();
        }     
    };

    return {
        init : function() {
            console.log('Application has started');
            setupEventListeners();
        }
    }

})(budgetController,UIController);

appController.init();