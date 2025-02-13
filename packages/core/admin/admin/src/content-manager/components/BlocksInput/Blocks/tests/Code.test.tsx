/* eslint-disable testing-library/no-node-access */
import { render, screen, within } from '@testing-library/react';
import { createEditor, Transforms, Editor } from 'slate';

import { codeBlocks } from '../Code';

import { Wrapper } from './Wrapper';

describe('Code', () => {
  it('renders a code block properly', () => {
    render(
      codeBlocks.code.renderElement({
        children: 'Some code',
        element: {
          type: 'code',
          children: [{ type: 'text', text: 'Some code' }],
        },
        attributes: {
          'data-slate-node': 'element',
          ref: null,
        },
      }),
      {
        wrapper: Wrapper,
      }
    );

    const pre = screen.getByRole('code');
    expect(pre).toBeInTheDocument();

    const code = within(pre).getByText('Some code');
    expect(code).toBeInTheDocument();
  });

  it('handles enter key on code block', () => {
    const baseEditor = createEditor();
    baseEditor.children = [
      {
        type: 'code',
        children: [
          {
            type: 'text',
            text: 'Line of code',
          },
        ],
      },
    ];

    // Set the cursor at the end of the fast list item
    Transforms.select(baseEditor, {
      anchor: Editor.end(baseEditor, []),
      focus: Editor.end(baseEditor, []),
    });

    // Simulate the enter key
    codeBlocks.code.handleEnterKey!(baseEditor);

    // Should insert a newline within the code block (shoudn't exit the code block)
    expect(baseEditor.children).toEqual([
      {
        type: 'code',
        children: [
          {
            type: 'text',
            text: 'Line of code\n',
          },
        ],
      },
    ]);
  });
});
