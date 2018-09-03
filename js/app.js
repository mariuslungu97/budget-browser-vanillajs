var budgetController = (function() {
    function Income(desc,val) {
        this.description = description;
        this.value = val;
    }

    function Expense(desc,val,perc) {
        this.description = desc;
        this.value = val;
        this.percentage = perc;
    }
})();

var UIController = (function() {

   
    
    return {
        uiMarkup : {
            addInputButton : '.add__btn',
            descriptionBox : '.add__description',
            valueBox : '.add__value',
            inputType : '.add__type',
            redFocus : 'red-focus'
        },
        checkInput : function() {
            var description = document.querySelector(this.uiMarkup.descriptionBox).value;
            var numericValue = document.querySelector(this.uiMarkup.valueBox).value;

            if(description && numericValue) return true;
            else return false;
        },

        changeInputColor : function(type) {
            if(type === 'expense') {
                document.querySelector(this.uiMarkup.descriptionBox).classList.add(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.valueBox).classList.add(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.inputType).classList.add(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.addInputButton).style.color = '#FF5049';
            } else if(type === 'income') {
                document.querySelector(this.uiMarkup.descriptionBox).classList.remove(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.valueBox).classList.remove(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.inputType).classList.remove(this.uiMarkup.redFocus);
                document.querySelector(this.uiMarkup.addInputButton).style.color = '#28B9B5';
            }
        }
        
    }
})();


//We could have also used the budgetController and UIController variables directly in the app controller
//but this would make the other controllers a little bit less independent
//Ex : if you would change the name of the budgetController into something else, you would have needed to change it
//all around the appController.
var appController = (function(budgetCtrl,UICtrl) {
    //Local variable for the UI Markup
    var markup = UICtrl.uiMarkup;
    var inputNode = document.querySelector(markup.inputType);
    //select the value of the selectedIndex
    var inputType = inputNode.options[inputNode.selectedIndex].value;
    
    //Add Button Event Handler
    document.querySelector(markup.addInputButton).addEventListener('click',function() {
        // 1. Check if all the inputs are completed.
        if(UICtrl.checkInput()) {
            // 2. Read the input and create a new income or expense

            // 3. Calculate and update the budget

            // 4. Clear Input
            
            
            
        }
        

    });

    document.querySelector(markup.inputType).addEventListener('change',function() {
        inputType = inputNode.options[inputNode.selectedIndex].value;
        UICtrl.changeInputColor(inputType);
    });


})(budgetController,UIController);