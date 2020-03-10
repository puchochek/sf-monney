import { LightningElement, api } from 'lwc';
import createCategory from '@salesforce/apex/ExpenseCategoryController.createCategory';

const DEFAULT_CARD_ICON = 'utility:question';
export default class CategoryCreateEditForm extends LightningElement {

    headerIcon;
    cardIcon = DEFAULT_CARD_ICON;
    headerTitle = 'Add new category';
    cancelBtn = 'Cancel';
    saveBtn = 'Save';
    nameLbl = 'Name';
    descriptionLbl = 'Description';
    chengeIconLbl = 'Change icon';
    iconLbl = 'Change icon';
    namePlaceholder = 'Category name';
    descriptionPlaceholder = 'Category description';
    iconHint = 'Click to select a new icon';
    isIconsSetShown;
    categoryToEdit;
    monneyUserId;

    @api
    get categoryToUpsert() {
        return this._categoryToUpsert;
    }
    set categoryToUpsert(value) {
        this.setCategoryToUpsert(value);
    }

    setCategoryToUpsert(category) {
        const categoryToUpsert = JSON.parse(JSON.stringify(category));
        const isCategoryToEditPassed = this.checkIfCategoryToEditPassed(categoryToUpsert);

        if (isCategoryToEditPassed) {
            this.categoryToEdit = categoryToUpsert;
        } else {
            this.monneyUserId = categoryToUpsert.monneyUserId;
        }
    }

    checkIfCategoryToEditPassed(category) {
        return category.hasOwnProperty('id') ? true : false;
    }

    saveCategory() {
        const categoryJSON = this.getCategoryJSON();
        const bulkCategoriesJSON = [categoryJSON];

        console.log('---> categoryInput ', categoryJSON);
        if (categoryJSON) {
            createCategory({ "categories": JSON.stringify(bulkCategoriesJSON) })
                .then(result => {
                    if (result) {
                        //console.log('---> result', result);
                        // this.upsertedExpenses = JSON.parse(result);
                        // this.handleSuccessResult();
                    } else {
                        //this.handleErrorResult();
                    }
                });
        } else {
            //this.handleErrorResult(TOAST_INPUT_ERROR_MESSAGE);
        }
    }

    getCategoryJSON() {
        const categoryInput = this.getCategoryInput();

        let categoryToUpsert;
        if (this.categoryToEdit) {
            categoryToUpsert = this.addExistedCategoryDataToInput(categoryInput);
        } else {
            categoryToUpsert = this.addMonneyUserIdToInput(categoryInput);
        }

        return categoryToUpsert;
    }

    getCategoryInput() {
        const nameInput = this.template.querySelector("[name='name']");
        const descriptionInput = this.template.querySelector("[name='description']");
        const selectedIcon = this.cardIcon;

        const cardInput = {
            name: nameInput.value,
            description: descriptionInput.value,
            icon: selectedIcon,
        };

        return cardInput;
    }

    addExistedCategoryDataToInput(categoryInput) {
        const newCategory = { ...categoryInput };
        const existedCategory = { ...this.categoryToEdit };

        const categoryToUpsert = {
            ...newCategory,
            isIncome: existedCategory.isIncome,
            monneyUserId: existedCategory.monneyUserId
        };

        return categoryToUpsert;
    }

    addMonneyUserIdToInput(categoryInput) {
        const newCategory = { ...categoryInput };

        const categoryToUpsert = {
            ...newCategory,
            monneyUserId: this.monneyUserId
        };

        return categoryToUpsert;
    }

    openIconsSetCmp() {
        this.isIconsSetShown = true;
    }

    setSelectedIcon(event) {
        this.isIconsSetShown = false;
        const selectedIcon = JSON.parse(JSON.stringify(event.detail));
        this.cardIcon = selectedIcon;
    }

    dispatchCloseCategoryFormEvent() {
        const upsertedCategories = [];

        const closeCategoryForm = new CustomEvent("closecategoryform", {
            detail: upsertedCategories
        });

        this.dispatchEvent(closeCategoryForm);
    }
}