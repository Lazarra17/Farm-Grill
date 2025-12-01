/*
@Author:  Chad Lazarra
@Date: Nov 22
@History:
*/
public class OpportunityTriggerHandler extends TriggerHandler{
    private Map<Id, Opportunity> newOppMap;
    private List<Opportunity> newOpp;
    
    public OpportunityTriggerHandler() {
        this.newOppMap = (Map<Id, Opportunity>) Trigger.newMap;
        this.newOpp = (List<Opportunity>) Trigger.new;
    }
    
    public override void afterUpdate() {
        
    }
    
    

}