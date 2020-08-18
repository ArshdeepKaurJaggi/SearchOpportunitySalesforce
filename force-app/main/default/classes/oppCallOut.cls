@isTest
global class oppCallOut implements HttpCalloutMock {
  global HTTPResponse respond(HTTPRequest request) {
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('{"Name " : "Test Opp","Account" : "Test Account","Stage" : "Prospecting","Type" : "New Customer","Amount" : 10000.00, "Close Date" : "2020-08-10",Integration_Status__c="Success"}');
        response.setStatusCode(200);
        response.setStatusCode(201);
        return response; 
    }
}