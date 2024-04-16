import { Command } from 'commander';
import pkg from '../package.json';
import Changelog from './main';

const program = new Command();
program.version(pkg.version);

program
  .command('release')
  .argument('[type]', 'upgrade type')
  .action(async (...args) => {
    const [type] = args || [];

    const changelog = new Changelog();
    await changelog.init({ type });
    try {
      await changelog.release();
    } catch (error: any) {
      console.log(error.message);
      await changelog.rollingBack();
    }
  });

program.parse(process.argv);
