@isTest
public with sharing class testClassGetOpportunity {
    static testmethod void testOpp(){
        Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        Opportunity opp = new Opportunity(Name ='Test Opp',AccountId=acc.Id,StageName='Prospecting',Integration_Status__c='Success',Amount=10000,CloseDate = system.today() + 60,Type = 'New Customer');
        insert opp;
        list<Opportunity> opList = getOpportunity.getOpportunityList();
        System.assertEquals(1, opList.size());
        
        list<Opportunity> op = getOpportunity.searchOpportunity('Test');
        System.assertEquals('Test Opp', op[0].Name);
        
    }
}