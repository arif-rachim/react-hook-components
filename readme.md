# React hook components

React hook components is a small TypeScript library of React layout components and hooks for building forms and sliding panels quickly without a CSS framework. It provides `Horizontal` and `Vertical`, flexbox `div` wrappers whose alignment, margin, padding, size, radius and background are set through short props such as `hAlign`, `mT` or `p`; `useForm`, a form-state hook with a masked `Input` component (built on Cleave.js) that tracks values, touched and modified fields, and per-field validation errors; and `useSlidePanel`, a hook that slides a panel in from any edge of a container and returns a promise that resolves with the value the panel closes with. State is held in observers from `react-hook-useobserver`, so typing in one field re-renders only the components that read it. The package targets React 16.14 or later, compiles to both CommonJS and ES modules with the TypeScript compiler, and is published to npm as `react-hook-components`. It is an alpha release (`1.0.0-alpha.36`, June 2022) with no tests and is not actively maintained.

> Status: alpha, last updated June 2022. Not actively maintained.

## Features

- `Horizontal` / `Vertical`: `display: flex` containers with `flex-direction` row or column and `box-sizing: border-box`, forwarding refs and all normal `div` attributes
- Layout props: `hAlign` (`left` / `center` / `right`), `vAlign` (`top` / `center` / `bottom`), margins `m`, `mT`, `mR`, `mB`, `mL`, paddings `p`, `pT`, `pR`, `pB`, `pL`, size `w`, `h`, radius `r`, `rTL`, `rTR`, `rBL`, `rBR`, `overflow`, `position`, `top` / `left` / `right` / `bottom`, `color`
- `backgroundColor` with optional `backgroundBrightness` and `backgroundOpacity`, adjusted with tinycolor2
- `useForm(initialState)` returns a `Form` provider, observers for `$state`, `$errors`, `$touched`, `$modified`, and `validateForm()`
- `Input`: a Cleave.js masked input bound to a form field, with `valueMapper` / `valueConverter` to translate between the stored value and the displayed string, and a `validator` that returns an error string or list
- `useSlidePanel()` returns `SlidePanel` (the container) and `showPanel(render, {animation, overlayHidden})`, which stacks panels, dims the background, animates them in over 300 ms, and resolves with the result passed to `close`

## Tech stack

TypeScript · React (16.14+) · react-hook-useobserver · Cleave.js · tinycolor2 · Jest + Enzyme (configured)

## Installation

```bash
npm install react-hook-components
```

`react` and `react-dom` 16.14 or later are peer dependencies.

## Usage

```tsx
import {Horizontal, Vertical, useForm, Input, useSlidePanel} from 'react-hook-components';

function Example() {
    const {Form, validateForm, $state} = useForm({name: '', amount: 0});
    const {SlidePanel, showPanel} = useSlidePanel();

    async function onSubmit() {
        if (!validateForm()) return;
        const confirmed = await showPanel(close => (
            <Vertical p={20} backgroundColor="#fff">
                Save {$state.current.name}?
                <Horizontal hAlign="right" mT={10}>
                    <button onClick={() => close(false)}>Cancel</button>
                    <button onClick={() => close(true)}>Save</button>
                </Horizontal>
            </Vertical>
        ), {animation: 'bottom'});
        console.log('confirmed', confirmed);
    }

    return <SlidePanel style={{height: 400}}>
        <Form>
            <Vertical p={10}>
                <Input field="name" options={{}}
                       validator={({formStateFieldValue}) => formStateFieldValue ? [] : 'Name is required'}/>
                <Input field="amount" options={{numeral: true}}
                       valueMapper={v => String(v ?? '')} valueConverter={s => parseFloat(s.replace(/,/g, ''))}/>
                <Horizontal hAlign="right" mT={10}>
                    <button onClick={onSubmit}>Submit</button>
                </Horizontal>
            </Vertical>
        </Form>
    </SlidePanel>;
}
```

## Exports

| Export | Kind |
|---|---|
| `Horizontal`, `Vertical` | Layout components |
| `useForm`, `FormContext`, `Input` | Form hook, its context, and the masked input |
| `InputProps`, `ValidatorType`, `ValidatorTypeProps` | Form types |
| `useSlidePanel` | Slide panel hook |
| `ShowPanelType`, `ShowPanelCallback`, `AnimationType`, `ConfigType` | Slide panel types |

## Development

```bash
npm install
npm run build      # tsc to lib/cjs (CommonJS) and lib/esm (ES modules)
npm start          # build in watch mode
npm test           # jest --coverage
```

## Project structure

```text
src/index.tsx             public exports
src/layout/LayoutProps.ts layout props and the hook that turns them into styles
src/layout/Horizontal.tsx row container
src/layout/Vertical.tsx   column container
src/layout/useForm.tsx    form state, FormContext, masked Input
src/layout/useSlidePanel.tsx slide-in panel hook
src/useTheme.tsx, src/utils.ts  theme context and color helpers (not exported)
```

## Limitations

- There are no test files yet, so `npm test` finds nothing to run.
- The Grid and Sheet components mentioned in the commit history were removed; they are not part of the package.
- `src/layout/SFProText/` contains font files and a stylesheet that nothing imports.

## License

[MIT](LICENSE)
