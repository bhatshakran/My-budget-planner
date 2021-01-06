








// bdgt controller
let  budgetController = (function() {
class Expenses {
    constructor(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
    }
    calcPercentage(totalIncome) {
        if(totalIncome>0) {
            this.percentage = Math.round((this.value/ totalIncome) *100)
        }
    }

    getPercentage(){
        return this.percentage;
    }
}

class Income{
    constructor(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
        
    }
}


    let data = {
        allItems:{
            exp:[],
            inc: []
        },
        totals:{
            exp:0,
            inc:0
        },
        budget: 0,
        percentage: -1
    };
    let calculateTotal= function(type) {
        let sum = 0;
        data.allItems[type].forEach(cur => sum += parseInt(cur.value))
        data.totals[type] = sum;
    }

    return{
         addItem : function(type, des, val){
            // create an id for the items
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else {
                ID = 0;
            }

            // check if the item is exp or inc
            if(type === 'exp') {
                newItem = new Expenses(ID, des, val)
            }else if(type === 'inc') {
                newItem = new Income(ID, des , val)
            };

            // add the item to the data
            data.allItems[type].push(newItem);
            // return the newitem
            return newItem;
        },
        deleteItem : function(type,id){
            let ids,index;
            ids = data.allItems[type].map(cur => cur.id);
            index = ids.indexOf(id)
            if(index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function() {
            // calculate total income and expenses
            calculateTotal('exp')
            calculateTotal('inc')
            // calculate the budget
            data.budget = data.totals.inc - data.totals.exp;
            // calculate the percentage
            if(data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/ data.totals.inc) * 100)
            }else{
                data.percentage = -1;
            }
        },

        getBudget: function() {
            return {
                budget :data.budget,
                totalInc :data.totals.inc,
                totalExp :data.totals.exp,
                percentage: data.percentage
            }
        },
        calculatePercentage: function() {
            data.allItems.exp.forEach(cur => cur.calcPercentage(data.totals.inc))
        
        },
        getPercentage: function() {
            let  allPerc = data.allItems.exp.map(cur => cur.getPercentage());
            return allPerc
        },
        testing: function() {
            console.log(data);
        }
    }
})();






// uicontroller
var  uicontroller = (function() {
    const DOMStrings ={
        topCard: '.top-card',
        bottomCard: '.bottom-card',
        item: '.item',
        button: '.button',
        type: '.plusorminus',
        description: '.description',
        value: '.value',
        ok : '.tick',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        expPercLabel: '.item__percentage',
        actual :'.actualItems',
        dateLabel: '.budget__title--month'
     };
     let formatNumber = function(num, type) {
        var numSplit, int, dec, type;
        /*
            + or - before number
            exactly 2 decimal points
            comma separating the thousands

            2310.4567 -> + 2,310.46
            2000 -> + 2,000.00
            */

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //input 23510, output 23,510
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

    };
     return{
        getInput:function() {
            return{
                type:document.querySelector(DOMStrings.type).value,
                description: document.querySelector(DOMStrings.description).value,
                value: document.querySelector(DOMStrings.value).value,
                
                
            };
            
        },
        addListItem : function(obj, type) {
            let html, newHtml, element;
            //  create the html string with a placeholder here
            if(type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id"><div class="item__description">%description</div><div class="item__value">+%value &#x20B9</div><div class="item__delete"><img src="delete.png" alt="" class="dlt-btn"></div></div>';
            }else if( type === 'exp'){
                element = DOMStrings.expensesContainer;
                html= '<div class="item clearfix" id="exp-%id"><div class="item__description">%description</div><div class="item__value">-%value &#x20B9</div><div class="item__percentage">21%</div><div class="item__delete"><img src="delete.png" alt="" class="dlt-btn"></div></div>';
            }
            // replace the placeholder with actual data
            newHtml = html.replace('%id', obj.id);
            newHtml = newHtml.replace('%description', obj.description);
            newHtml= newHtml.replace('%value', obj.value)


            // insert the html in the dom
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        deleteListItem: function(selectorID){
            let el;
            el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
        clearInputFields: function(){
            let fields, newFields;
            fields = document.querySelectorAll(`${DOMStrings.description}, ${DOMStrings.value}`);
            newFields = Array.from(fields);
            newFields.forEach(el => el.value ="");
            newFields[0].focus();
        },
        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            if(obj.percentage>0){
                document.querySelector(DOMStrings.percentageLabel).textContent = `${obj.percentage} % `;
            }else{
                document.querySelector(DOMStrings.percentageLabel).textContent = `---`;
            }
            
           
        },
        displayPercentage: function(perc) {
            let percList,newList;
            percList = document.querySelectorAll(DOMStrings.expPercLabel);
            newList= Array.from(percList);
            newList.forEach((cur, index) =>{
                if(perc[index] >=0){
                    cur.textContent = `${formatNumber(perc[index], 'exp' )}%`;
                }else{
                    cur.textContent = '---'
                }
                
            })
        },
        displayMonth: function() {
            var now, months, month, year;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25);
            
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' ' + year;
        },

        
         getDOMStrings:function() {
             return DOMStrings;
         }
     }
})();





// controller


var controller = (function(bdgtctrl,uictrl) {

    

    var setUpEventListeners = function() {
       const DOM =  uictrl.getDOMStrings();
        document.querySelector(DOM.button).addEventListener('click', function() {
            document.querySelector(DOM.topCard).style.transform = 'translateY(-900px)';
            document.querySelector(DOM.bottomCard).style.transform = 'translateY(-700px)';
            document.querySelector(DOM.ok).addEventListener('click', ctrlAddItem);
            document.addEventListener('keypress', (e) => {
                if(e.keyCode === 13 || e.which ===13){
                    ctrlAddItem();
                }
            })
        });
        document.querySelector(DOM.actual).addEventListener('click', ctrlDltItem)
       
    };
    const updateBudget = function() {
    // 1.calculate the budgett
    bdgtctrl.calculateBudget();
    // 2.return the budget
    let budget = bdgtctrl.getBudget();
    // 3.display the budget
    uictrl.displayBudget(budget);
    };

    const updatePercentage = function() {
        // calculate the percentage
        bdgtctrl.calculatePercentage();
        // get the percentage
        let percentages = bdgtctrl.getPercentage()
        // display the percentage
        uictrl.displayPercentage(percentages);
    };
    const ctrlAddItem = function() {
        // get input
        let input, newItem;
        input = uictrl.getInput();
       

        // add the item to the budget controller
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            newItem = bdgtctrl.addItem(input.type, input.description, input.value)
        }

        // add the item in the ui
        uictrl.addListItem(newItem, input.type)
    
        // clear the input fields
        uictrl.clearInputFields();
        // update the budget
        updateBudget();

        // update the percentage
        updatePercentage();
    };
    const ctrlDltItem = function(e) {

        let itemID, splitID, type, id;
        itemID = e.target.parentNode.parentNode.id;
        console.log(itemID);
        splitID = itemID.split('-');
        type = splitID[0],
        id = parseInt(splitID[1]),
        // delete the item from the data
        bdgtctrl.deleteItem(type, id)
        // delete the item from ui
        uictrl.deleteListItem(itemID);
        // update the budget
        updateBudget();
        // update the percentages
        updatePercentage();
    }
    return{
        init:function() {
            console.log('Application has started!');
            setUpEventListeners();
            uictrl.displayBudget({
                budget: 0,
                totalExp: 0,
                totalInc: 0,
                percentage: -1

            })
            uictrl.displayMonth();
        }
    }
})(budgetController, uicontroller)
controller.init();
