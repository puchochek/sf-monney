import { LightningElement } from 'lwc';

export default class ErrorNotification extends LightningElement {
    errorHeader = 'OOPS!';
    errorSubHeader = 'Looks like something is wrong.';
    errorText = 'Please, contact Your administratior to resolve the problem.'
}