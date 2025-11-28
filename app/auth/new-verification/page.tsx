import { NewVerificationForm } from "@/components/auth/new-verification-form";

const NewVerificationPage = () => {
    return (
        <div className="flex h-full items-center justify-center bg-gradient-to-b from-white to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <NewVerificationForm />
        </div>
    );
};

export default NewVerificationPage;
