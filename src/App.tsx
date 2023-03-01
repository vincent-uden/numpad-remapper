import Scrollbars from "solid-custom-scrollbars";
import {
  Accessor,
  Component,
  createContext,
  createSignal,
  Setter,
  useContext,
} from "solid-js";

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

keyboardId := AHI.GetKeyboardId(0x062A, 0x4101)
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
      <div class="h-32" />
      <div class="flex w-full flex-row items-center justify-center">
        <BindingsProvider>
          <div class="max-w-50vw max-h-90vh grid grid-cols-4 grid-rows-6 gap-4">
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

          <aside class="flex h-full flex-col pl-8">
            <h2
              class="border-green/20 hover:border-green/50 cursor-pointer select-none rounded-xl border-solid bg-neutral-900 p-4 font-sans font-extralight text-white transition-colors"
              onClick={() => {
                setExporting(true);
              }}
            >
              Export
            </h2>
          </aside>

          <ExportPopup open={exporting} setOpen={setExporting} />
        </BindingsProvider>
      </div>
      <h1 class="font-roboto mt-16 mb-4 w-full text-center text-6xl font-light text-white">
        NumPad Remapper
      </h1>
      <h2 class="font-roboto w-full text-center text-3xl font-light text-white">
        A generator for AHK + AHI
      </h2>
    </>
  );
};

const KeyPadBtn: Component<BtnProps> = ({ key, rows, cols }) => {
  const [bindings, setBindings] = useContext(NumPadContext);
  const [editing, setEditing] = createSignal(false);

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
        class={`-hover:translate-y-2 whitespace-pre-line break-words rounded-xl border-2 border-solid border-white/20 bg-neutral-900 p-4 font-sans text-xl text-white shadow-xl transition-transform`}
        style={{
          "grid-column": `span ${cols ?? 1}`,
          "grid-row": `span ${rows ?? 1}`,
          //"aspect-ratio": rows == 1 && cols == 1 ? "1/1" : "auto",
        }}
        onClick={() => setEditing((e) => !e)}
      >
        {bindings != null ? reflowLabel(bindings()[key]) : ""}
      </div>

      <div
        class={`fixed top-0 left-0 h-screen w-screen ${
          editing()
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        } flex items-center justify-center bg-black/20 transition-opacity`}
        onMouseDown={() => setEditing((e) => !e)}
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
      } flex items-center justify-center bg-black/20 transition-opacity`}
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

const NumPadContext = createContext<
  [Accessor<BindingSetup>?, Setter<BindingSetup>?]
>([null, null]);

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
