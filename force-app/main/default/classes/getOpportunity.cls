public with  sharing class getOpportunity {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityList(){
        return [select id,Name,Amount,StageName,Type,Account.Name from Opportunity];
    }
    @AuraEnabled (cacheable = true)
    public static List<Opportunity> searchOpportunity(String keyword){
        string key = '%'+ keyword + '%';
        // Decimal num = Decimal.valueOf(keyword);
        // if(keyword.isNumeric()){
        //     // return  [select id,Name,Amount,StageName,Type,Account.Name from Opportunity where Amount = num ];
        // }
        return [select id,Name,Amount,StageName,Type,Account.Name, Account.Id from Opportunity 
        where Name LIKE: key OR StageName LIKE: key OR Type LIKE: key OR Account.Name LIKE: key];
    }
}