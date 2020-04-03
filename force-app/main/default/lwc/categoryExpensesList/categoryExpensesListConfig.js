const columns = [
    {
        label: 'Date',
        fieldName: 'transactionDate',
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Sum',
        fieldName: 'sum',
        type: 'number',
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Comment',
        fieldName: 'comment',
        cellAttributes: { alignment: 'left' }
    },
    {
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'utility:edit',
            title: 'Edit',
            name: 'edit',
            variant: 'border-filled',
            alternativeText: 'edit'
        }
    },
    {
        type: 'button-icon',
        initialWidth: 75,
        typeAttributes: {
            iconName: 'utility:delete',
            title: 'Delete',
            name: 'delete',
            variant: 'border-filled',
            alternativeText: 'delete'
        }
    },
];

export default { columns }