---
title: 'Data Structure'
description: 'Lorem ipsum dolor sit amet'
pubDate: '12 24 2024'
heroImage: '/blog-placeholder-2.jpg'
---
## Leftist heap 
#### Concepts
  - 外节点：a node without 2 children;
  - `null path length`：从当前节点到最近的外节点所经过的边数；
    - 空节点的`Npl`为`-1`，外节点的`Npl`为`0`；
- 需要满足的性质：
  1. 堆的性质；
  2. **左偏**的性质：`node->left->Npl >= node->right->Npl`；
  3. `node->Npl = node->right->Npl + 1`；
  4. 右路径上存在`r`个节点的左偏堆，其节点数`N`满足 $N \leq 2^{r} - 1$；

#### Operations
> 声明结构体如下（小顶堆为例）：
```c
#define Element_type int
typedef struct heap_node{
    Element_type element;
    struct heap_node* left;
    struct heap_node* right;
    int Npl;
}heap_node;

typedef heap_node* leftist_heap;
```

<br>

##### merge(A,B) 
<br>确保A的堆顶元素较小，将A的右子树与B的根节点合并，得到新的堆；递归执行且每次检查是否满足左偏的性质。
```c
leftist_heap merge(leftist_heap H1, leftist_heap H2 ){
    if( H1 == NULL) return H2;
    if( H2 == NULL) return H1;
    //make sure H1 is the smaller one
    if( H1->element < H2->element)
        return merge1(H1, H2);
    else return merge1(H2, H1);
}

leftist_heap merge1(leftist_heap H1, leftist_heap H2 ){
    //case 1: H1 is a leaf node, and it must has left child
    if( H1->left == NULL)
        H1->left = H2;
    else{
        H1->right = merge(H1->right, H2);
        //update Npl if necessary
        if(H1->left->Npl < H1->right->Npl){
            //swap children
            heap_node* temp = H1->left;
            H1->left = H1->right;
            H1->right = temp;
        }
        //update Npl of H1
        H1->Npl = 1 + H1->right->Npl;
    }
    return H1;
}

```
> `merge`操作是左偏堆操作当中的核心部分，`insert`与`delete`都可以基于`merge`操作实现。

##### insert(H,x)
> 利用`merge(H,x)`来实现，即将新节点视作一个用`x`填充的最小堆，然后与原堆合并.

##### delete
```c
leftist_heap delete(heap_node* cur, Element_type x){
    //cur not exist -> return
    if( cur == NULL) return NULL;

    //merge its children and replace it with the result
    if( cur->element == x){
        return merge( cur->left, cur->right);
    }else{
        //recurse on the left or right subtree
        if(cur->element > x)
            return cur; //not found
        
        cur->left = delete(cur->left, x);
        cur->right = delete(cur->right, x);
        //no need to check if child exists

        int left_Npl = cur->left ? cur->left->Npl : -1;
        int right_Npl = cur->right ? cur->right->Npl : -1;

        if(left_Npl < right_Npl){
            //swap children
            heap_node* temp = cur->left;
            cur->left = cur->right;
            cur->right = temp;
        }
        //update Npl of cur
        cur->Npl = 1 + ((cur->right == NULL) ? -1 : cur->right->Npl);  

        return cur;
    }
}
```
>令空节点的`Npl`为`-1`，便于计算；

---

## Skew Heap
- 为什么我们需要斜堆？
  - **Target**: Any M consecutive operations take at most O(M log N) time.
- 斜堆是左偏堆的一个简化版本：
  - 相比于频繁检查左偏性质并进行维护的左偏堆，斜堆为了达到`Target`，放弃了这种性质；
  - 取而代之是，斜堆在每次操作之后总是 交换其左右孩子，直到右路径上的最大节点不具有左孩子；
     >Always swap the left and right children except that the largest of all the nodes on the right paths does not have its children swapped.  No Npl.

### 势能分析

### Shortcut for merge
- 对于给出的两个堆，可以通过快速手算的方式一次构建结果；
- Steps:
  1. 取出两个堆的右路径上的所有节点，包含其左子树；
  2. 按从小到大的顺序合并节点，得到新的堆；
  3. 在此过程中保持原先的左子树结构不变，然后根据`leftist` / `skew` 性质调整其结构；
     1. `leftist`：如果左子树的`Npl`小于右子树的`Npl`，则交换左右孩子；
     2. `skew`：总是交换左右孩子（我们可以由此发现，此时左路经上的节点正是步骤`2`得到的有序序列）；
  4. 返回新的堆；


