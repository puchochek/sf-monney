import { LightningElement } from 'lwc';
import ICONS_SET from "./iconsSetUtills";

export default class IconsSet extends LightningElement {
    iconsSet;

    constructor() {
        super();
        this.iconsSet = ICONS_SET.getIconsSet();
    }

    passSelectedIconToCategoryForm(event) {
        const selectedIcon = event.target.dataset.item;

        const selectIconEvent = new CustomEvent("iconselected", {
            detail: selectedIcon
        });

        this.dispatchEvent(selectIconEvent);
    }
}