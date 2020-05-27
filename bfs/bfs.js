import Queue from './queue';

function BFS(start, isTarget) {
  const q = new Queue();
  const visited = new Set();

  q.offer(start);
  visited.add(start); // 避免回头
  let step = 0;

  while (!q.isEmpty()) {
    const sz = q.size();
    for (let i = 0; i < sz; i++) {
      const cur = q.poll();
      // 判断是否到达终点
      if (isTarget(cur)) {
        return step;
      }
      // 获得相邻节点
      const adj = cur.adj();
      for (const x of adj) {
        if (!visited.has(x)) {
          q.offer(x);
          visited.add(x);
        }
      }
    }
    step++;
  }
}

// 111. 二叉树的最小深度

function minDepth(root) {
  if (root == null) return 0;
  const q = new Queue();
  q.offer(root);
  let depth = 1;

  while (!q.isEmpty()) {
    const sz = q.size();
    for (let i = 0; i < sz; i++) {
      const cur = q.poll();
      if (cur.left == null && cur.right == null) {
        return depth;
      }
      if (cur.left != null) {
        q.offer(cur.left);
      }
      if (cur.right != null) {
        q.offer(cur.right);
      }
    }
    depth++;
  }

  return depth;
}

// 752. 打开转盘锁

function plusOne(s, j) {
  const len = s.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    if (i === j) {
      if (s[i] === '9') {
        str += '0';
      } else {
        str += +s[i] + 1;
      }
    } else {
      str += s[i];
    }
  }
  return str;
}

function minusOne(s, j) {
  const len = s.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    if (i === j) {
      if (s[i] === '0') {
        str += '9';
      } else {
        str += +s[i] - 1;
      }
    } else {
      str += s[i];
    }
  }
  return str;
}

function openLock(deadends, target) {
  const deads = new Set(deadends);
  const visited = new Set();
  const q = new Queue();
  let step = 0;
  q.offer('0000');
  visited.add('0000');

  while (!q.isEmpty()) {
    const sz = q.size();
    for (let i = 0; i < sz; i++) {
      const cur = q.poll();
      if (deads.has(cur)) continue;
      if (cur == target) return step;
      for (let j = 0; j < 4; j++) {
        const up = plusOne(cur, j);
        if (!visited.has(up)) {
          q.offer(up);
          visited.add(up);
        }
        const down = minusOne(cur, j);
        if (!visited.has(down)) {
          q.offer(down);
          visited.add(down);
        }
      }
    }
    step++;
  }
  return -1;
}
