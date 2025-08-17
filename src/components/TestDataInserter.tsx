import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { insertTestData } from "@/utils/insertTestData";

export const TestDataInserter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInsertData = async () => {
    setIsLoading(true);
    
    try {
      const result = await insertTestData();
      
      toast({
        title: "✅ Success",
        description: `Test data inserted successfully! ${result.total_inserted_records} records added.`,
      });
      
      console.log("Insert result:", result);
    } catch (error) {
      toast({
        title: "❌ Error",
        description: `Failed to insert test data: ${error.message}`,
        variant: "destructive",
      });
      
      console.error("Insert error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Insert Test Data</h2>
      <p className="mb-4 text-muted-foreground">
        Click the button below to insert the sample keyword intelligence and competitor intelligence data.
      </p>
      
      <Button 
        onClick={handleInsertData}
        disabled={isLoading}
        className="w-full max-w-xs"
      >
        {isLoading ? "Inserting..." : "Insert Test Data"}
      </Button>
    </div>
  );
};