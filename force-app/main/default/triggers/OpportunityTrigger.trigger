trigger OpportunityTrigger on Opportunity (before insert, before update, after insert, after update) {
    
    Trigger_Setting__mdt config = Trigger_Setting__mdt.getInstance('OpportunityTrigger');
    if(config != null){
        if(!config.Mute__c){
            new OpportunityTriggerHandler().run();
        }
        
    }
    
    
}