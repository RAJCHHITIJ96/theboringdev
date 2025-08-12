
import { Button } from '@/components/ui/button';

const FinalCTASection = () => {
  return (
    <section className="section-spacing">
      <div className="content-container">
        <div className="content-narrow text-center">
          <h2 className="section-headline mb-8">
            Start anywhere. Start now.
          </h2>
          
          <div className="prose mb-12">
            <p className="text-xl mb-6">
              The AI revolution is happening with or without you.
            </p>
            
            <p className="text-2xl font-bold">
              <strong>The question is: Will you have the intelligence to navigate it?</strong>
            </p>
          </div>
          
          <Button className="btn-primary text-lg px-8 py-4">
            <strong>Explore AI Intelligence →</strong>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
