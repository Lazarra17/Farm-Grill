/*
@Author: Chad Nico Lazarra
@Date:
@Desc:
@History: 21-Sept-2025
*/
public without sharing class ReceiptKitchenVfpExtension {
    
    // The standard controller for the Opportunity object
    public final Opportunity opp;
    
    // A list to hold the related Opportunity Line Items
    public List<OpportunityLineItem> opportunityLineItems {get; public set;}
    
    // The constructor for the extension
    public ReceiptKitchenVfpExtension(ApexPages.StandardController stdController) {
        // Get the current Opportunity record from the standard controller
        this.opp = (Opportunity)stdController.getRecord();
        
        // Query for the related Opportunity Line Items
        if (this.opp.Id != null) {
            opportunityLineItems = [
                SELECT
                Id,
                Product2.Name,
                Quantity,
                UnitPrice,
                TotalPrice
                FROM
                OpportunityLineItem
                WHERE
                OpportunityId = :this.opp.Id 
            ];
            
        } else {
            // Handle the case where there is no Opportunity Id (e.g., a new record)
            opportunityLineItems = new List<OpportunityLineItem>();
        }
    }
}