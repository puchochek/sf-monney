import { LightningElement } from 'lwc';

export default class CategoryCreateEditForm extends LightningElement {

    headerIcon = 'utility:question';
    headerTitle = 'Add new category';
    cancelBtn = 'Cancel';
    saveBtn = 'Save';
    nameLbl = 'Name';
    descriptionLbl = 'Description';
    chengeIconLbl = 'Change icon';
    iconLbl = 'Icon';
    namePlaceholder = 'Category name';
    descriptionPlaceholder = 'Category description';

    saveCategory() {
        const categoryInput = this.getCategoryInput();

    }

    getCategoryInput() {
        const nameInput = this.template.querySelector("[name='name']");
        const descriptionInput = this.template.querySelector("[name='description']");
        console.log('---> inpts', nameInput.value, ' ', descriptionInput.value );
       // const dateInput = this.template.querySelector("[name='date']");
    }

    dispatchCloseCategoryFormEvent() {
        const upsertedCategories = [];
        const closeCategoryForm = new CustomEvent("closecategoryform", {
            detail: upsertedCategories
        });

        this.dispatchEvent(closeCategoryForm);
    }
}