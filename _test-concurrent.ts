import { getFriendsWithPosts } from './src/lib/friends.ts';

// 模拟构建期：多个页面并发调用
const results = await Promise.all([
  getFriendsWithPosts(3),
  getFriendsWithPosts(3),
  getFriendsWithPosts(3),
]);

console.log('并发调用 3 次结果：');
for (let i = 0; i < results.length; i++) {
  const withPosts = results[i].filter((f) => f.posts.length).length;
  console.log(`  第 ${i + 1} 次: ${withPosts}/${results[i].length} 个友链有文章`);
  for (const f of results[i]) {
    console.log(`    ${f.title.slice(0, 20).padEnd(22)} mode=${f.mode.padEnd(8)} posts=${f.posts.length}`);
  }
}