public with sharing class sendData {
   @AuraEnabled()
   public static String sending(String selectedId){

    Opportunity row =[select id,Name,StageName,Type,Account.Name from Opportunity where Id =: selectedId];

    JSONGenerator gen = JSON.createGenerator(true);
    gen.writeStartObject();
    gen.writeStringField('Name', row.Name);
    // gen.writeStringField('Amount', row.Amount);
    gen.writeStringField('StageName', row.StageName);
    gen.writeStringField('Type', row.Type);
    gen.writeStringField('Account Name', row.Account.Name);
    gen.writeEndObject();

    String jsonS= gen.getAsString();
    System.debug(jsonS);

    Http http = new Http();
    HttpRequest request = new HttpRequest();
    request.setEndpoint('https://th-apex-http-callout.herokuapp.com/animals');
    request.setMethod('POST');
    request.setHeader('Content-Type', 'application/json;charset=UTF-8');
    // Set the body as a JSON object
    request.setBody(jsonS);
    HttpResponse response = http.send(request);
    System.debug(response.getStatusCode());
    if (response.getStatusCode() != 201) {       
        row.Integration_Status__c='Not Successful';
        row.Integration_Comments__c=response.getStatus();
        update row;
        System.debug(response.getStatusCode());    
    }
    
    else {
        
        row.Integration_Status__c='Success';
        row.Integration_Comments__c='Success : '+response.getStatus();
        update row;
        System.debug(response.getStatusCode());
        
    }
    return (row.Integration_Status__c);
}

}