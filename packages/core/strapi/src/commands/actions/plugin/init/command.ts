import type { StrapiCommand } from '../../../types';
import { runAction } from '../../../utils/helpers';
import action from './action';

/**
 * `$ strapi plugin:init`
 */
const command: StrapiCommand = ({ command }) => {
  command
    .command('plugin:init')
    .description('Create a new plugin at a given path')
    .argument('<path>', 'path to the plugin', './src/plugins')
    .option('-d, --debug', 'Enable debugging mode with verbose logs', false)
    .option('--silent', "Don't log anything", false)
    .action(runAction('plugin:init', action));
};

export default command;
