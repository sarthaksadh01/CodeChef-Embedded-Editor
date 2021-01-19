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
  7: 'SIGEMT',
  8: 'SIGFPE',
  9: 'SIGKILL',
  10: 'SIGBUS',
  11: 'SIGSEGV',
  12: 'SIGSYS',
  13: 'SIGPIPE',
  14: 'SIGALRM',
  15: 'SIGTERM',
  16: 'SIGUSR1',
  17: 'SIGUSR2',
  18: 'SIGCHLD',
  19: 'SIGPWR',
  20: 'SIGWINCH',
  21: 'SIGURG',
  22: 'SIGPOLL',
  23: 'SIGSTOP',
  24: 'SIGTSTP',
  25: 'SIGCONT',
  26: 'SIGTTIN',
  27: 'SIGTTOU',
  28: 'SIGVTALRM',
  29: 'SIGPROF',
  30: 'SIGXCPU',
  31: 'SIGXFSZ',
  32: 'SIGWAITING',
  33: 'SIGLWP',
  34: 'SIGAIO',
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
  server_errors: {
    url: '',
    message: 'Error',
  },
  score: {
    url: '',
    message: 'Score error',
  },
  limit: {
    url: '',
    message: 'Submission limit Reached',
  },
  error: {
    url: '',
    message:
      'Internal Error. This might be due to heavy load on our servers.' +
      ' Please try later.' +
      ' Note that you can also directly Submit the code without Running it,' +
      ' if you wish to.',
  },
};

const themeCode = ['eclipse', 'dracula'];
const kepMapCodes = ['default', 'vim', 'sublime'];

export {themeCode, languageCode, signalTable, statusImgs, kepMapCodes};
