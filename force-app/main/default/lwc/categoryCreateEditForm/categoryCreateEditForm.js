import { LightningElement } from 'lwc';

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

    saveCategory() {
        const categoryInput = this.getCategoryInput();

    }

    getCategoryInput() {
        const nameInput = this.template.querySelector("[name='name']");
        const descriptionInput = this.template.querySelector("[name='description']");
        const selectedIcon = this.cardIcon;
        console.log('---> inpts', nameInput.value, ' ', descriptionInput.value, ' ', selectedIcon);
        // const dateInput = this.template.querySelector("[name='date']");
    }

    openIconsSetCmp() {
        this.isIconsSetShown = true;
    }

    setSelectedIcon(event) {
        this.isIconsSetShown = false;
        const selectedIcon = JSON.parse(JSON.stringify(event.detail));
        this.cardIcon = selectedIcon;
        console.log('---> this.selectedIcon', selectedIcon);
    }

    dispatchCloseCategoryFormEvent() {
        const upsertedCategories = [];
        const closeCategoryForm = new CustomEvent("closecategoryform", {
            detail: upsertedCategories
        });

        this.dispatchEvent(closeCategoryForm);
    }
}