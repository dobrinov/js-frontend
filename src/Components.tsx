import { ReactNode } from "react";
import { Button } from "./Button";
import { PageLayout } from "./Layout";

export function Components() {
  return (
    <PageLayout title="Components">
      <Component
        name="Button"
        description="This is the description of the button element."
      >
        <Variation name="Default" description="The default button.">
          <State label="active">
            <Button text="Click me" onClick={() => console.log("clicked")} />
          </State>
          <State label="disabled">
            <Button text="Click me" disabled />
          </State>
        </Variation>
        <Variation name="Primary" description="The default button.">
          <State label="active">
            <Button text="Click me" style="primary" />
          </State>
          <State label="disabled">
            <Button text="Click me" style="primary" disabled />
          </State>
        </Variation>
        <Variation name="Dangerous" description="The dangerous button.">
          <State label="active">
            <Button text="Click me" style="dangerous" />
          </State>
          <State label="disabled">
            <Button text="Click me" style="dangerous" disabled />
          </State>
        </Variation>
      </Component>
    </PageLayout>
  );
}

function Component({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div>
      <strong className="mb-1 block text-xl font-bold leading-tight tracking-tight text-gray-900">
        {name}
      </strong>
      <p className="mb-3">{description}</p>
      <div>{children}</div>
    </div>
  );
}

function Variation({
  name,
  description,
  children,
}: {
  name: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <strong className="text-l mb-1 block font-bold leading-tight tracking-tight text-gray-900">
        {name}
      </strong>
      <p className="mb-1">{description}</p>
      <div className="mb-5 flex flex-wrap gap-3">{children}</div>
    </>
  );
}

function State({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="relative flex w-full flex-grow items-center justify-center rounded-md p-10 ring-1 ring-gray-300 md:w-auto">
      {children}
      <div className="label absolute right-0.5 top-0.5 rounded-bl-md rounded-tr-md bg-slate-200 px-1 text-sm text-gray-400">
        {label}
      </div>
    </div>
  );
}
