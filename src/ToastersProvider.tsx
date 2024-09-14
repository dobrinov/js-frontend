import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Subject } from "rxjs";
import { useObservable, useSubject } from "./rx";

type ToasterNotificationProps = {
  title: string;
  message: string;
  type: "success" | "error";
};

type ToastersContextType = {
  showToaster: (notification: ToasterNotificationProps) => void;
};

const ToastersContext = createContext<ToastersContextType | null>(null);

export function ToastersProvider({ children }: { children: ReactNode }) {
  const subject = useSubject<ToasterNotificationProps>();

  function showToaster(notification: ToasterNotificationProps) {
    subject.next(notification);
  }

  return (
    <>
      <ToastersContext.Provider value={{ showToaster }}>
        {children}
      </ToastersContext.Provider>
      <ToasterRenderer subject={subject} />
    </>
  );
}

function ToasterRenderer({
  subject,
}: {
  subject: Subject<ToasterNotificationProps>;
}) {
  const [notifications, setNotifications] = useState<
    (ToasterNotificationProps & { key: string })[]
  >([]);

  useObservable(
    subject,
    (notification) => {
      setNotifications((current) => [
        { ...notification, key: Math.random().toString() },
        ...current,
      ]);
    },
    [],
  );

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        {notifications.map((notification) => (
          <Toaster
            key={notification.key}
            notification={notification}
            close={() => {
              setNotifications((current) =>
                current.filter((n) => n.key !== notification.key),
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Toaster({
  notification,
  close,
}: {
  notification: ToasterNotificationProps;
  close: () => void;
}) {
  let icon: ReactNode;
  if (notification.type === "success") {
    icon = (
      <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
    );
  } else if (notification.type === "error") {
    icon = <XMarkIcon aria-hidden="true" className="h-6 w-6 text-red-400" />;
  } else {
    throw new Error("Invalid notification type");
  }
  useEffect(() => {
    const timer = setTimeout(close, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Transition show={true}>
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition data-[closed]:data-[enter]:translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">{icon}</div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                onClick={close}
                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}

export function useToasters(): ToastersContextType {
  const context = useContext(ToastersContext);

  if (!context) {
    throw new Error("useToasters must be used within a ToastersProvider");
  }

  return context;
}
