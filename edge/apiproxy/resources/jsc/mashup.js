var address = context.getVariable('address');
var responsePayload = JSON.parse(context.getVariable('response.content'));
try{
    responsePayload.entities[0].address = address;
    context.setVariable('response.content', JSON.stringify(responsePayload));
    context.setVariable('mashupAddressSuccess', true);
} 
catch(e) {
    print('Error occurred when trying to add the address to the response.');
    context.setVariable('mashupAddressSuccess', false);
}