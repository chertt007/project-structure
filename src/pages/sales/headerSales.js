const headerSales = [

  {
    id: 'id',
    title: 'ID',
    sortable: true,
    sortType: 'number'
  },

  {
    id: 'user',
    title: 'Client',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'createdAt',
    title: 'Date',
    sortable: true,
    template: data => {
      const newDate = new Date(data);
      const string = newDate.toLocaleDateString();
      return `<div class="sortable-table__cell">
          ${string}
        </div>`;
    },
    sortType: 'number'
  },
  {
    id: 'totalCost',
    title: 'Price',
    sortable: true,
    sortType: 'number',

  },
  {
    id: 'delivery',
    title: 'Status',
    sortable: true,
    sortType: 'string',
  }
];

export default headerSales;
