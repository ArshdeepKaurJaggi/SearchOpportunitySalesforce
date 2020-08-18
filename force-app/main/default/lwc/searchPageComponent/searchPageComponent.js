import { LightningElement, wire, track } from 'lwc';
import getOpportunityList from '@salesforce/apex/getOpportunity.getOpportunityList'
import searchOpportunity from '@salesforce/apex/getOpportunity.searchOpportunity';
import sending from '@salesforce/apex/sendData.sending';
import { ShowToastEvent } from "lightning/platformShowToastEvent";


const actions = [
    { label: 'Send', name: 'Send' },
];

const columns = [
    {
        label: 'Name', fieldName: 'nameurl', type: 'url',
        typeAttributes: {
            label: { fieldName: 'Name' },
            target: '_blank'
        },
    },
    { label: 'Amount', fieldName: 'Amount', type: 'currency', typeAttributes: { currencyCode: 'INR' }, cellAttributes: { alignment: 'left' } },
    { label: 'Stage', fieldName: 'StageName' },
    { label: 'Type', fieldName: 'Type' },
    {
        label: 'Account Name', fieldName: 'accounturl', type: 'url',
        typeAttributes: {
            label: { fieldName: 'AccountName' },
            target: '_blank'
        },
    },
    { type: 'action', typeAttributes: { rowActions: actions, menuAlignment: 'right' } },
];


export default class SearchPageComponent extends LightningElement {

    @track chartConfiguration;

    @track isModalOpen = false;
    hasPrev = false;
    hasNext = true;
    columns = columns;
    variantValue = 'Brand';
    data;
    pageNumber;
    copyofdata;
    recordsPerPage;
    value = 0;
    curr = 0;
    key = '';
    searchlist;
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }
    @wire(getOpportunityList) Opportunity(result) {
        if (result.data) {
            let values = [];
            result.data.forEach(i => {
                let value = {};
                value.Id = i.Id;
                value.Name = i.Name;
                value.nameurl = `/${i.Id}`;
                value.StageName = i.StageName;
                value.Type = i.Type;
                value.Amount = i.Amount;
                value.AccountName = i.Account.Name;
                value.accounturl = `/${i.Account.Id}`;
                values.push(value);
            });
            this.data = values;
            this.copyofdata = values;
            //console.log(this.data);
            let chartData = [];
            let chartLabels = [];
            result.data.forEach(opp => {
                chartData.push(opp.Amount);
                chartLabels.push(opp.Name);
            });
            this.chartConfiguration = {
                type: 'bar',
                data: {
                    labels: chartLabels,
                    datasets: [
                        {
                            label: 'All Opportunities',
                            barPercentage: 0.5,
                            barThickness: 6,
                            maxBarThickness: 8,
                            minBarLength: 2,
                            backgroundColor: "#abd13b",
                            data: chartData,
                        },
                    ],
                },
                options: {
                },
            };


        } else if (result.error) {
            this.data = undefined;
            this.error = result.error;
            this.chartConfiguration = undefined;
        }
    }

    getrowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        const id = row.Id;
        try {
            sending({ selectedId: id })
                .then(data => {

                    const evt = new ShowToastEvent({
                        title: "Fields Updates",
                        message: data,
                        variant: "success",
                        mode: "dismissable"
                    });
                    this.dispatchEvent(evt);
                }).catch(err => console.log(err));
        }
        catch (error) {
            console.log(error);
        }

    }
    // @wire(getOpportunityList) opportunity;

    handleKeyWordChange(event) {
        this.pageNumber = 1;
        const keyword = event.target.value;
        keyword.toUpperCase();
        this.key = keyword;
        //console.log(keyword);

        if (keyword != "") {
            searchOpportunity({ keyword }).then(result => {
                let values = [];
                result.forEach(i => {
                    let value = {};
                    value.Id = i.Id;
                    value.Name = i.Name;
                    value.nameurl = `/${i.Id}`;
                    value.StageName = i.StageName;
                    value.Type = i.Type;
                    value.Amount = i.Amount;
                    value.AccountName = i.Account.Name;
                    value.accounturl = `/${i.Account.Id}`;
                    values.push(value);
                });
                this.searchlist = values;
                if (this.value < this.copyofdata.length) {
                    this.data = values.slice(0, this.value);

                    // if (values != []) {
                    //     console.log('not null');
                    //     this.valsearch = this.value;
                    // }
                    // console.log(result);
                }
                else {
                    this.data = values;
                }
            })
            // this.data = this.copyofdata.filter(item => item.Name.includes(keyword));
        } else {
            if (this.value < this.copyofdata.length) {
                this.data = this.copyofdata.slice(0, this.value);
            }
            else {
                this.data = null;
            }
        }
    }

    handleBoxChange(event) {
        this.value = event.detail.value;
        //console.log(this.value);
        if (this.value < this.copyofdata.length) {
            this.data = this.copyofdata.slice(0, this.value);
            console.log(this.copyofdata.slice(0, this.value));
            this.curr = this.value;
            console.log(this.curr);
        } else {
            this.data = null;
        }
    }
    onNext() {
        if (this.key == '') {
            if (this.value < this.copyofdata.length && this.curr < this.copyofdata.length) {
                this.data = this.copyofdata.slice(this.curr, +this.curr + +this.value);
                this.curr = +this.curr + +this.value;
                if (this.curr >= this.copyofdata.length) {
                    this.hasNext = false;
                    this.hasPrev = true;
                }
                this.hasPrev = true;
            } else {
                this.hasNext = false;
                this.hasPrev = true;
            }
        } else {
            if (this.value < this.searchlist.length && this.curr < this.searchlist.length) {
                this.data = this.searchlist.slice(this.curr, +this.curr + +this.value);
                this.curr = +this.curr + +this.value;
                if (this.curr >= this.searchlist.length) {
                    this.hasNext = false;
                    this.hasPrev = true;
                }
                this.hasPrev = true;
            } else {
                this.hasNext = false;
                this.hasPrev = true;
            }
        }
    }
    onPrev() {
        if (this.key == '') {
            if (this.value >= 0 && this.curr >= 0) {
                this.data = this.copyofdata.slice(+this.curr - +this.value, this.curr);
                this.curr = +this.curr - +this.value;
                if (this.curr <= 0) {
                    this.hasNext = true;
                    this.hasPrev = false;
                }
                this.hasNext = true;
            } else {
                this.hasNext = true;
                this.hasPrev = false;
            }
        }
        else {
            if (this.value >= 0 && this.curr >= 0) {
                this.data = this.searchlist.slice(+this.curr - +this.value, this.curr);
                this.curr = +this.curr - +this.value;
                if (this.curr <= 0) {
                    this.hasNext = true;
                    this.hasPrev = false;
                }
                this.hasNext = true;
            } else {
                this.hasNext = true;
                this.hasPrev = false;
            }
        }
    }
}
