/* eslint-disable check-file/filename-naming-convention */

import * as React from 'react';

import { lightTheme, ThemeProvider } from '@strapi/design-system';
import { type Attribute } from '@strapi/types';
import { render, renderHook, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import { createEditor } from 'slate';
import { Slate, withReact } from 'slate-react';

import { codeBlocks } from '../../Blocks/Code';
import { headingBlocks } from '../../Blocks/Heading';
import { imageBlocks } from '../../Blocks/Image';
import { linkBlocks } from '../../Blocks/Link';
import { listBlocks } from '../../Blocks/List';
import { paragraphBlocks } from '../../Blocks/Paragraph';
import { quoteBlocks } from '../../Blocks/Quote';
import { type BlocksStore, BlocksEditorProvider } from '../../BlocksEditor';
import { useModifiersStore } from '../useModifiersStore';

const initialValue: Attribute.BlocksValue = [
  {
    type: 'paragraph',
    children: [{ type: 'text', text: 'A line of text in a paragraph.' }],
  },
];

const blocks: BlocksStore = {
  ...paragraphBlocks,
  ...headingBlocks,
  ...listBlocks,
  ...linkBlocks,
  ...imageBlocks,
  ...quoteBlocks,
  ...codeBlocks,
};

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const editor = React.useMemo(() => withReact(createEditor()), []);

  return (
    <ThemeProvider theme={lightTheme}>
      <IntlProvider messages={{}} locale="en">
        <Slate initialValue={initialValue} editor={editor}>
          <BlocksEditorProvider blocks={blocks} disabled={false}>
            {children}
          </BlocksEditorProvider>
        </Slate>
      </IntlProvider>
    </ThemeProvider>
  );
};

describe('useModifiersStore', () => {
  it('should return a store of modifiers', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    const storeKeys = Object.keys(result.current);

    expect(storeKeys).toContain('bold');
    expect(storeKeys).toContain('italic');
    expect(storeKeys).toContain('underline');
    expect(storeKeys).toContain('strikethrough');
    expect(storeKeys).toContain('code');

    Object.values(result.current).forEach((modifier) => {
      expect(modifier).toHaveProperty('icon');
      expect(modifier).toHaveProperty('label.id');
      expect(modifier).toHaveProperty('label.defaultMessage');
      expect(modifier).toHaveProperty('checkIsActive');
      expect(modifier).toHaveProperty('handleToggle');
      expect(modifier).toHaveProperty('renderLeaf');
    });
  });

  it('should render a bold modifier properly', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    render(result.current.bold.renderLeaf('This is bold text'), { wrapper: Wrapper });
    const boldText = screen.getByText('This is bold text');
    expect(boldText).toHaveStyle('font-weight: 600');
  });

  it('should render an italic modifier properly', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    render(result.current.italic.renderLeaf('This is italic text'), { wrapper: Wrapper });
    const italicText = screen.getByText('This is italic text');
    expect(italicText).toHaveStyle('font-style: italic');
  });

  it('should render an underline modifier properly', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    render(result.current.underline.renderLeaf('This is underlined text'), { wrapper: Wrapper });
    const underlineText = screen.getByText('This is underlined text');
    expect(underlineText).toHaveStyle('text-decoration: underline');
  });

  it('should render a strikethrough modifier properly', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    render(result.current.strikethrough.renderLeaf('This is strikethrough text'), {
      wrapper: Wrapper,
    });
    const strikethroughText = screen.getByText('This is strikethrough text');
    expect(strikethroughText).toHaveStyle('text-decoration: line-through');
  });

  it('should render a code modifier properly', () => {
    const { result } = renderHook(useModifiersStore, { wrapper: Wrapper });

    render(result.current.code.renderLeaf('This is code text'), { wrapper: Wrapper });
    const codeText = screen.getByText('This is code text');
    expect(window.getComputedStyle(codeText).fontFamily).toMatch(/\bmonospace\b/i);
  });
});
