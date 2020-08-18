@isTest
public with sharing class testClassOpportunity {
   static testmethod void testOpp(){
       
    	Account acc = new Account(Name = 'Test Account');
        insert acc;
        
        Opportunity opp = new Opportunity(Name ='Test Opp',AccountId=acc.Id,StageName='Prospecting',Integration_Status__c='Success',Amount=10000,CloseDate = system.today() + 60,Type = 'New Customer');
        insert opp;
        
        String id1=opp.id;
       //Opportunity opp1 = new Opportunity(Name ='Test Opp',AccountId=acc.Id,StageName='Prospecting',Integration_Status__c='Success',Amount=10000,CloseDate = system.today() + 60,Type = 'New Customer');
        //system.assert(opp1!=null);
        
        
        Test.setMock(HttpCalloutMock.class, new oppCallOut());  
        
        Test.startTest();
        sendData.sending(id1);
        Test.stopTest();
   }
}