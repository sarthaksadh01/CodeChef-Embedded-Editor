/* eslint-disable no-tabs */
const cpp = `#include <bits/stdc++.h>
using namespace std;

int main() {
	// your code goes here
	return 0;
}

`;

const c = `
#include <stdio.h>

int main(void) {
	// your code goes here
	return 0;
}

`;

const python = ``;

const java = `
/* package codechef; // don't place package name! */

import java.util.*;
import java.lang.*;
import java.io.*;

/* Name of the class has to be "Main" only if the class is public. */
class Codechef
{
	public static void main (String[] args) throws java.lang.Exception
	{
		// your code goes here
	}
}

`;

const languageCode = [
  {
    code: 11,
    name: 'C',
    mode: 'text/x-c++src',
    defaultCode: c,
  },
  {
    code: 44,
    name: 'C++ 14',
    mode: 'text/x-c++src',
    defaultCode: cpp,
  },
  {
    code: 63,
    name: 'C++ 17',
    mode: 'text/x-c++src',
    defaultCode: cpp,
  },
  {
    code: 116,
    name: 'Python 3',
    mode: 'python',
    defaultCode: python,
  },
  {
    code: 4,
    name: 'Python 2',
    mode: 'python',
    defaultCode: python,
  },
  {
    code: 10,
    name: 'Java',
    mode: 'text/x-java',
    defaultCode: java,
  },
];

const signalTable = {
  1: 'SIGHUP',
  2: 'SIGINT',
  3: 'SIGQUIT',
  4: 'SIGILL',
  5: 'SIGTRAP',
  6: 'SIGABRT',
  6: 'SIGIOT',
  7: 'SIGBUS',
  8: 'SIGFPE',
  9: 'SIGKILL',
  10: 'SIGUSR1',
  11: 'SIGSEGV',
  12: 'SIGUSR2',
  13: 'SIGPIPE',
  14: 'SIGALRM',
  15: 'SIGTERM',
  16: 'SIGSTKFLT',
  17: 'SIGCHLD',
  17: 'SIGCLD',
  18: 'SIGCONT',
  19: 'SIGSTOP',
  20: 'SIGTSTP',
  21: 'SIGTTIN',
  22: 'SIGTTOU',
  23: 'SIGURG',
  24: 'SIGXCPU',
  25: 'SIGXFSZ',
  26: 'SIGVTALRM',
  27: 'SIGPROF',
  28: 'SIGWINCH',
  29: 'SIGPOLL',
  29: 'SIGIO',
  30: 'SIGPWR',
  31: 'SIGSYS',
  32: 'SIGRTMIN-2',
  33: 'SIGRTMIN-1',
  34: 'SIGRTMIN',
  35: 'SIGRTMIN+1',
  36: 'SIGRTMIN+2',
  37: 'SIGRTMIN+3',
  38: 'SIGRTMIN+4',
  39: 'SIGRTMIN+5',
  40: 'SIGRTMIN+6',
  41: 'SIGRTMIN+7',
  42: 'SIGRTMIN+8',
  43: 'SIGRTMIN+9',
  44: 'SIGRTMIN+10',
  45: 'SIGRTMIN+11',
  46: 'SIGRTMIN+12',
  47: 'SIGRTMIN+13',
  48: 'SIGRTMIN+14',
  49: 'SIGRTMIN+15',
  50: 'SIGRTMAX-14',
  51: 'SIGRTMAX-13',
  52: 'SIGRTMAX-12',
  53: 'SIGRTMAX-11',
  54: 'SIGRTMAX-10',
  55: 'SIGRTMAX-9',
  56: 'SIGRTMAX-8',
  57: 'SIGRTMAX-7',
  58: 'SIGRTMAX-6',
  59: 'SIGRTMAX-5',
  60: 'SIGRTMAX-4',
  61: 'SIGRTMAX-3',
  62: 'SIGRTMAX-2',
  63: 'SIGRTMAX-1',
  64: 'SIGRTMAX',
};

const statusImgs = {
  compile: {
    url: 'https://www.codechef.com/misc/alert-icon.gif',
    message: 'Compilation Error',
  },
  wrong: {
    url: 'https://www.codechef.com/misc/cross-icon.gif',
    message: 'Wrong Answer',
  },
  time: {
    url: 'https://www.codechef.com/misc/clock_error.png',
    message: 'Time Limit Exceeded',
  },
  partial_accepted: {
    url:
      'https://www.codechef.com/sites/all/modules/codechef_tags/images/partially-solved.png',
    message: 'Partially Accepted',
  },
  accepted: {
    url: 'https://www.codechef.com/misc/tick-icon.gif',
    message: 'All Correct',
  },
  runtime: {
    url: 'https://www.codechef.com/misc/runtime-error.png',
    message: 'Runtime Error',
  },
};

const themeCode = ['xq-light', 'dracula'];
const kepMapCodes = ['default','vim', 'sublime'];

export {themeCode, languageCode, signalTable, statusImgs,kepMapCodes};
