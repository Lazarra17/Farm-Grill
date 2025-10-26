/*
@Author: Chad Lazarra (shagilazarra@gmail.com)
@Date:
@Desc:
@History

*/ 
public class ReceiptExpenseVfExtensions {
    
    public ReceiptExpenseVfExtensions(ApexPages.StandardController std) {
     
    }
    
    public String getFormattedTimestamp() {
        // Example datetime: current time
        Datetime nowDT = System.now();
        
        // Format: 12-hour format with AM/PM, localized per user
        // 'h' = 12-hour, 'mm' = minutes, 'a' = AM/PM marker
        return nowDT.format('MMM dd, yyyy hh:mm a');
    }
}