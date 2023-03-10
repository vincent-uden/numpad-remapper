import Scrollbars from "solid-custom-scrollbars";
import {
  Accessor,
  Component,
  createContext,
  createSignal,
  Setter,
  useContext,
} from "solid-js";

import githubImg from "./img/github.png";

type BindingSetup = {
  esc: string;
  tab: string;
  backspace: string;
  fn: string;
  numLock: string;
  slash: string;
  star: string;
  minus: string;
  plus: string;
  enter: string;
  one: string;
  two: string;
  three: string;
  four: string;
  five: string;
  six: string;
  seven: string;
  eight: string;
  nine: string;
  zero: string;
  dot: string;
  device_id: string;
};

type BtnProps = {
  key: keyof BindingSetup;
  rows?: number;
  cols?: number;
};

type ExportPopupProps = {
  open: Accessor<boolean>;
  setOpen: Setter<boolean>;
};

const defaultBindings: BindingSetup = {
  esc: "Esc",
  tab: "Tab",
  backspace: "<-",
  fn: "Fn",
  numLock: "Num Lock",
  slash: "/",
  star: "*",
  minus: "-",
  plus: "+",
  enter: "Enter",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
  dot: ".",
  device_id: "0x0000, 0x0000",
};

const keyCodeMapping = {
  esc: 1,
  tab: 15,
  backspace: 14,
  fn: null,
  numLock: null,
  slash: 309,
  star: 55,
  minus: 74,
  plus: 78,
  enter: 284,
  one: 79,
  two: 80,
  three: 81,
  four: 75,
  five: 76,
  six: 77,
  seven: 71,
  eight: 72,
  nine: 73,
  zero: 82,
  dot: 83,
};

function ahkKey(key: string): string {
  let lowered = key.toLowerCase();

  if (lowered == "control") {
    lowered = "Control";
  } else if (lowered == "ctrl") {
    lowered = "Control";
  } else if (lowered == "shift") {
    lowered = "Shift";
  } else if (lowered == "alt") {
    lowered = "Alt";
  } else if (lowered == "<-") {
    lowered = "BackSpace";
  } else if (lowered == "backspace") {
    lowered = "BackSpace";
  } else if (lowered == "del") {
    lowered = "Del";
  } else if (lowered == "delete") {
    lowered = "Del";
  }

  return lowered;
}

function exportKeyBindings(keyBinding: BindingSetup): string {
  let output = `
#NoEnv
SendMode, Input
SetWorkingDir %A_ScriptDir%

#SingleInstance force
#Persistent
#include <AutoHotInterception>

AHI := new AutoHotInterception()

keyboardId := AHI.GetKeyboardId(${keyBinding.device_id})
AHI.SubscribeKeyboard(keyboardId, true, Func("KeyEvent"))

return

KeyEvent(code, state){`;

  for (const [key, val] of Object.entries(keyBinding)) {
    if (keyCodeMapping[key] != null) {
      output += `
    if (state=1) & (code=${keyCodeMapping[key]}) {
        Send {${ahkKey(val)} down}
    }

    if (state=0) & (code=${keyCodeMapping[key]}) {
        Send {${ahkKey(val)} up}
    }
    `;
    }
  }

  output += `
}`;

  return output;
}

const App: Component = () => {
  const [exporting, setExporting] = createSignal(false);

  return (
    <>
      <div class="relative min-h-screen overflow-x-hidden">
        <div class="h-8" />
        <div class="flex w-full flex-col items-center justify-center md:flex-row">
          <BindingsProvider>
            <div class="max-w-100 max-h-170 grid grid-cols-4 grid-rows-6 gap-4">
              <KeyPadBtn key={"esc"} rows={1} cols={1} />
              <KeyPadBtn key={"tab"} rows={1} cols={1} />
              <KeyPadBtn key={"backspace"} rows={1} cols={1} />
              <KeyPadBtn key={"fn"} rows={1} cols={1} />
              <KeyPadBtn key={"numLock"} rows={1} cols={1} />
              <KeyPadBtn key={"slash"} rows={1} cols={1} />
              <KeyPadBtn key={"star"} rows={1} cols={1} />
              <KeyPadBtn key={"minus"} rows={1} cols={1} />
              <KeyPadBtn key={"seven"} rows={1} cols={1} />
              <KeyPadBtn key={"eight"} rows={1} cols={1} />
              <KeyPadBtn key={"nine"} rows={1} cols={1} />
              <KeyPadBtn key={"plus"} rows={2} cols={1} />
              <KeyPadBtn key={"four"} rows={1} cols={1} />
              <KeyPadBtn key={"five"} rows={1} cols={1} />
              <KeyPadBtn key={"six"} rows={1} cols={1} />
              <KeyPadBtn key={"one"} rows={1} cols={1} />
              <KeyPadBtn key={"two"} rows={1} cols={1} />
              <KeyPadBtn key={"three"} rows={1} cols={1} />
              <KeyPadBtn key={"enter"} rows={2} cols={1} />
              <KeyPadBtn key={"zero"} rows={1} cols={2} />
              <KeyPadBtn key={"dot"} rows={1} cols={1} />
            </div>

            <aside class="flex h-full flex-col p-0 md:pl-8">
              <DeviceIdInput />
              <h2
                class="border-green/20 hover:border-green/50 cursor-pointer select-none rounded-xl border-solid bg-neutral-900 p-4 font-sans font-extralight text-white transition-colors"
                onClick={() => {
                  setExporting(true);
                }}
              >
                Export
              </h2>
              <div class="rounded-xl border-2 border-solid border-white/20 p-4">
                <p class="w-50 mt-0 font-sans text-white transition-colors">
                  Make sure you have{" "}
                  <a
                    class="font-extrabold text-white no-underline"
                    href="https://www.autohotkey.com/"
                  >
                    AHK
                  </a>{" "}
                  and{" "}
                  <a
                    class="font-extrabold text-white no-underline"
                    href="https://github.com/evilC/AutoHotInterception"
                  >
                    AHI
                  </a>{" "}
                  installed with AHI placed in the AHK lib directory.
                </p>
                <p class="w-50 m-0 font-sans text-white transition-colors">
                  The device id can be obtained using the Monitor script
                  included with AHI.
                </p>
              </div>
            </aside>

            <ExportPopup open={exporting} setOpen={setExporting} />
          </BindingsProvider>
        </div>
        <h1 class="font-roboto pointer-events-none relative z-10 mt-16 mb-4 w-full text-center text-6xl font-light text-white">
          NumPad Remapper
        </h1>
        <h2 class="font-roboto pointer-events-none relative z-10 text-center text-xl font-light text-white md:text-3xl">
          A generator for AHK + AHI
        </h2>
        <div class="h-16" />
        <a
          class="absolute bottom-10 -right-8"
          href="https://github.com/vincent-uden/numpad-remapper"
        >
          <img
            class="-rotate-30 aspect-square w-60 opacity-50"
            src={githubImg}
            alt="github"
            srcset=""
          />
        </a>
      </div>
    </>
  );
};

const KeyPadBtn: Component<BtnProps> = ({ key, rows, cols }) => {
  const [bindings, setBindings] = useContext(NumPadContext);
  const [editing, setEditing] = createSignal(false);

  let textInp;

  const reflowLabel = (text: string): string => {
    const parts = text.split(" ");
    if (parts.length > 1) {
      return parts.join("\n");
    }
    return text;
  };

  return (
    <>
      <div
        class={`-hover:translate-y-2 whitespace-pre-line break-words rounded-xl border-2 border-solid border-white/20 bg-neutral-900 p-4 font-sans text-base text-white shadow-xl transition-transform md:text-xl`}
        style={{
          "grid-column": `span ${cols ?? 1}`,
          "grid-row": `span ${rows ?? 1}`,
        }}
        onClick={() => {
          setEditing((e) => !e);
          textInp.focus();
        }}
      >
        {bindings != null ? reflowLabel(bindings()[key]) : ""}
      </div>

      <div
        class={`fixed top-0 left-0 h-screen w-screen ${
          editing()
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } z-30 flex items-center justify-center bg-black/20 transition-opacity`}
        onMouseDown={() => {
          setEditing((e) => !e);
        }}
      >
        <div
          class="rounded-xl bg-zinc-700 px-16 py-8 shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <h2 class="font-xl mt-0 mb-4 font-sans font-extralight text-white">
            Set Keybinding for {defaultBindings[key]}
          </h2>
          <input
            type="text"
            name={`keybind-${key}`}
            id={`keybind-${key}`}
            placeholder={`${defaultBindings[key]}`}
            ref={textInp}
            class="font-lg border-none bg-zinc-800 py-2 px-2 font-sans text-white shadow-none outline-none"
            onkeyup={(e) => {
              setBindings((current) => {
                console.log(e);
                if (e.currentTarget.value === "") {
                  current[key] = defaultBindings[key];
                } else {
                  current[key] = e.currentTarget.value;
                }
                return current;
              });
            }}
            onkeydown={(e) => {
              if (e.key == "Enter") {
                setEditing(false);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

const ExportPopup: Component<ExportPopupProps> = ({ open, setOpen }) => {
  const [bindings, setBindings] = useContext(NumPadContext);

  return (
    <div
      class={`fixed top-0 left-0 h-screen w-screen ${
        open()
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      } z-30 flex items-center justify-center bg-black/20 transition-opacity`}
      onMouseDown={() => setOpen((e) => !e)}
    >
      <div
        class="m-0 rounded-xl p-0 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Scrollbars style={{ width: "30rem", height: "70vh" }}>
          <pre class="m-0 select-all bg-neutral-800 p-4 text-white">
            {bindings != null ? exportKeyBindings(bindings()) : ""}
          </pre>
        </Scrollbars>
      </div>
    </div>
  );
};

const DeviceIdInput: Component = ({}) => {
  const [bindings, setBindings] = useContext(NumPadContext);

  const deviceIdRegex = /[0-9a-f]x[0-9a-f]{4}, ?[0-9a-f]x[0-9a-f]{4}/i;

  return (
    <>
      <label
        class="font-roboto w-full text-lg font-light text-white"
        for="device_id"
      >
        Numpad Hardware Id
      </label>
      <input
        id="device_id"
        type="text"
        name="device_id"
        class="font-lg border-none bg-zinc-800 py-2 px-2 font-sans text-white shadow-none outline-none"
        placeholder={defaultBindings.device_id}
        value={bindings().device_id}
        onkeyup={(e) => {
          setBindings((current) => {
            current.device_id = e.currentTarget.value;
            return current;
          });
        }}
      />
      <p
        class={`font-roboto text-red mb-0 w-40 text-base font-bold ${
          bindings().device_id.match(deviceIdRegex) && bindings().device_id.length <= 14
            ? "opacity-0"
            : "opacity-100"
        } transition-opacity`}
      >
        A device hardware id is of the form "0x0000, 0x0000"
      </p>
    </>
  );
};

const NumPadContext = createContext<
  [Accessor<BindingSetup>?, Setter<BindingSetup>?]
>(createSignal(Object.assign({}, defaultBindings)));

const BindingsProvider = (props) => {
  const [bindings, setBindings] = createSignal<BindingSetup>(
    Object.assign({}, defaultBindings),
    {
      equals: false,
    }
  );

  return (
    <NumPadContext.Provider value={[bindings, setBindings]}>
      {props.children}
    </NumPadContext.Provider>
  );
};

export default App;
