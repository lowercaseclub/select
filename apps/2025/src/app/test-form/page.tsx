import { ApplicationForm } from "../../components/application-form";
import { Button } from "@ui/components/button";

export default function TestFormPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <ApplicationForm trigger={<Button>Open Application Form</Button>} />
    </div>
  );
}
