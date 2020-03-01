import { LightningElement, wire, track } from 'lwc';
import USER_ID from '@salesforce/user/Id';
import monney from '@salesforce/resourceUrl/monney';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader';
import getMonneyUser from '@salesforce/apex/MonneyHomeController.getMonneyUser';

export default class MonneyHome extends LightningElement {
    currentAppUser;
    monneyHomeTitle = 'Monney';
    incomeCategory;
    isDataLoaded = false

    constructor() {
        super();
        this.getExistedMonneyUser();
    }

    connectedCallback() {
        loadStyle(this, monney + '/monney/styles.css');
    }

    getExistedMonneyUser() {
        if (USER_ID) {
            getMonneyUser({ "userId": USER_ID })
                .then(result => {
                    this.currentAppUser = JSON.parse(result);
                    console.log('---> currentAppUser H', this.currentAppUser);
                    this.incomeCategory = this.currentAppUser.categoriesWithExpenses.find(category => category.isIncome);
                    console.log('---> this.incomeCategory H', this.incomeCategory);
                    this.isDataLoaded = true;
                })
                .catch(error => {
                    this.error = error;

                });
        }
    }
}