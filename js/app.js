

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
        this.percentage = -1;
    }

    Expense.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
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

        calculatePercentages : function() {
            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPercentages : function() {
            var percList = data.allItems.exp.map(function(current) {
                return current.getPercentage();
            });
            return percList;
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

        deleteItem : function(type,id) {
            var ids;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            console.log(ids);

            var index = ids.indexOf(id);
            

            if(index !== -1) data.allItems[type].splice(index,1);
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
        expenseList : '.expenses__list',
        itemPercentage : '.item__percentage'
    };

    var formatNumber = function(num, type) {
        var numArr,int, dec, sign;
        num = Math.abs(num);
        num = num.toFixed(2);

        numArr = num.split('.');
        int = numArr[0];

        if(int.length > 3) {
            //2,314
            int = int.substring(0 , int.length -3) + ',' + int.substring(int.length-3,int.length);
        }
        dec = numArr[1];

        type === 'exp' ? sign = '-' : sign = '+';
        return sign + ' ' + int + '.' + dec;
    }
   
    
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
            var inputArray = Array.prototype.slice.call(document.querySelectorAll(uiMarkup.descriptionBox + ', ' + uiMarkup.valueBox));

            inputArray.forEach(function(item) {
                item.value = '';
            });

            inputArray[0].focus();
        },

        displayBudget : function(budget) {
            var type;
            budget.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(uiMarkup.incomeValue).textContent =formatNumber(budget.totals.inc,'inc');
            document.querySelector(uiMarkup.expenseValue).textContent = formatNumber(budget.totals.exp,'exp');
            document.querySelector(uiMarkup.budgetValue).textContent = formatNumber(budget.budget,type);

            if(budget.percentage > 0) {
                document.querySelector(uiMarkup.expensePercentage).textContent = budget.percentage + '%';
            } else {
                document.querySelector(uiMarkup.expensePercentage).textContent = '---';
            }
        },

        displayPercentages : function(percentages) {
            var percentageList = document.querySelectorAll(uiMarkup.itemPercentage);

            var nodeListForEach = function(list, callback) {
                for(var i = 0; i < list.length; i++) {
                    callback(list[i],i);
                }
            };

            nodeListForEach(percentageList,function(current,index) {
                if(percentages[index] > 0) current.textContent = percentages[index] + '%';
                else current.textContent = '---';
            });
        },

        addListItem : function(obj, type) {
            var html,newHtml,element;

            if(type === 'inc') {
                element = uiMarkup.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else {
                element = uiMarkup.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newHtml = html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value,type));
            

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        },

        

        deleteListItem : function(selectorId) {
            document.getElementById(selectorId).parentNode.removeChild(document.getElementById(selectorId));
        },
        
        changeInputColor : function(type) {
            var fields = document.querySelectorAll(uiMarkup.descriptionBox + ', ' + uiMarkup.valueBox + ', ' + uiMarkup.inputType + ', ' + uiMarkup.addInputButton);
            var fieldsArr = Array.prototype.slice.call(fields);
            if(type === 'exp') {
                fieldsArr.forEach(function(current) {
                    current.classList.add(uiMarkup.redFocus);
                    
                });
                fieldsArr[3].style.color = '#FF5049';
            } else if(type === 'inc') {
                fieldsArr.forEach(function(current) {
                    current.classList.remove(uiMarkup.redFocus);
                   
                });
                fieldsArr[3].style.color = '#28B9B5';
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
        });

        document.addEventListener('click',deleteListItem);

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
        // 7. Display the budget
        UICtrl.displayBudget(budgets);

    };

    var calculatePercentages = function() {
        // 1. Calculate Percentages
        budgetCtrl.calculatePercentages();
        // 2. Read Percentages
        var percentages = budgetCtrl.getPercentages();
        // 3. Display the percentages to the UI
        UICtrl.displayPercentages(percentages);

    }
    
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

            calculatePercentages();
        }     
    };

    var deleteListItem = function(event) {
        var itemId;

        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        

        if(itemId) {
            var splitId,type,id;
            splitId = itemId.split('-');
            type = splitId[0];
            id = splitId[1];
            

            budgetCtrl.deleteItem(type,parseInt(id));
            UICtrl.deleteListItem(itemId);
            calculateBudget();
            calculatePercentages();
        }
    }

    return {
        init : function() {
            console.log('Application has started');
            UICtrl.displayBudget(
                {
                    totals : 
                    {
                    inc : 0,
                    exp : 0,
                    },
                    budget : 0,
                    percentage : -1
                }
            );
            setupEventListeners();
        }
    }

})(budgetController,UIController);

appController.init();