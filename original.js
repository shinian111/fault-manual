document.addEventListener('DOMContentLoaded', function() {
            // 获取DOM元素
            const faultTree = document.getElementById('fault-tree');
            const treeLoading = document.getElementById('treeLoading');
            
            // 加载JSON数据
            fetch('fault-data.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('网络响应不正常');
                    }
                    return response.json();
                })
                .then(data => {
                    // 隐藏加载提示
                    treeLoading.style.display = 'none';
                    
                    // 生成故障树
                    generateFaultTree(data.categories, faultTree);
                    
                    // 初始化交互功能
                    initTreeInteractions();
                })
                .catch(error => {
                    console.error('加载故障数据失败:', error);
                    treeLoading.innerHTML = '<p style="color: red;">加载故障数据失败，请刷新页面重试</p>';
                });
            
            // 生成故障树的函数
            function generateFaultTree(categories, container) {
                categories.forEach(category => {
                    const li = document.createElement('li');
                    
                    // 创建分类节点
                    const categoryNode = document.createElement('div');
                    categoryNode.className = 'node';
                    categoryNode.setAttribute('data-type', 'category');
                    categoryNode.innerHTML = `
                        <i class="${category.icon}"></i>
                        <span class="node-text">${category.name}</span>
                    `;
                    
                    li.appendChild(categoryNode);
                    
                    // 如果有子分类或故障项
                    if (category.subcategories && category.subcategories.length > 0) {
                        const subUl = document.createElement('ul');
                        
                        category.subcategories.forEach(subcategory => {
                            const subLi = document.createElement('li');
                            
                            // 创建子分类节点
                            const subcategoryNode = document.createElement('div');
                            subcategoryNode.className = 'node';
                            subcategoryNode.setAttribute('data-type', 'subcategory');
                            subcategoryNode.innerHTML = `
                                <i class="${subcategory.icon}"></i>
                                <span class="node-text">${subcategory.name}</span>
                            `;
                            
                            subLi.appendChild(subcategoryNode);
                            
                            // 如果有故障项
                            if (subcategory.faults && subcategory.faults.length > 0) {
                                const faultUl = document.createElement('ul');
                                
                                subcategory.faults.forEach(fault => {
                                    const faultLi = document.createElement('li');
                                    
                                    // 创建故障节点
                                    const faultNode = document.createElement('div');
                                    faultNode.className = 'node fault-node';
                                    faultNode.setAttribute('data-type', 'fault');
                                    faultNode.setAttribute('data-id', fault.id);
                                    faultNode.setAttribute('data-measures', fault.measures);
                                    faultNode.setAttribute('data-root-cause', fault.rootCause);
                                    faultNode.innerHTML = `
                                        <i class="${fault.icon}"></i>
                                        <span class="node-text">${fault.nodeText}</span>
                                    `;
                                    
                                    faultLi.appendChild(faultNode);
                                    faultUl.appendChild(faultLi);
                                });
                                
                                subLi.appendChild(faultUl);
                            }
                            
                            subUl.appendChild(subLi);
                        });
                        
                        li.appendChild(subUl);
                    }
                    
                    container.appendChild(li);
                });
            }
            
            // 初始化树形结构的交互功能
            function initTreeInteractions() {
                // 获取所有节点
                const nodes = document.querySelectorAll('.node');
                const infoDisplay = document.querySelector('.info-display');
                const searchInput = document.getElementById('searchInput');
                const noResults = document.querySelector('.no-results');
                
                // 初始化：折叠所有文件夹节点
                const allFolders = document.querySelectorAll('.node[data-type="category"], .node[data-type="subcategory"]');
                allFolders.forEach(node => {
                    const icon = node.querySelector('i');
                    if (icon.classList.contains('fa-folder-open')) {
                        icon.classList.remove('fa-folder-open');
                        icon.classList.add('fa-folder');
                    }
                });
                
                // 隐藏所有子节点
                const allChildUl = document.querySelectorAll('.tree > li > ul, .tree ul ul');
                allChildUl.forEach(ul => {
                    ul.style.display = 'none';
                });
                
                // 添加点击事件到所有节点
                nodes.forEach(node => {
                    node.addEventListener('click', function(e) {
                        e.stopPropagation();
                        
                        // 移除所有节点的active类
                        nodes.forEach(n => n.classList.remove('active'));
                        
                        // 为当前节点添加active类
                        this.classList.add('active');
                        
                        // 处理文件夹展开/折叠
                        const nodeType = this.getAttribute('data-type');
                        if (nodeType === 'category' || nodeType === 'subcategory') {
                            const icon = this.querySelector('i');
                            const childList = this.nextElementSibling;
                            
                            if (childList && childList.tagName === 'UL') {
                                if (childList.style.display === 'none' || !childList.style.display) {
                                    childList.style.display = 'block';
                                    icon.classList.remove('fa-folder');
                                    icon.classList.add('fa-folder-open');
                                } else {
                                    childList.style.display = 'none';
                                    icon.classList.remove('fa-folder-open');
                                    icon.classList.add('fa-folder');
                                }
                            }
                        }
                        
                        // 如果是故障节点，显示详细信息
                        if (nodeType === 'fault') {
                            const measures = this.getAttribute('data-measures');
                            const rootCause = this.getAttribute('data-root-cause');
                            
                            if (measures && rootCause) {
                                infoDisplay.innerHTML = `
                                    <div class="info-section">
                                        <h3 class="info-header"><i class="fas fa-tools"></i>维修措施</h3>
                                        <div class="info-content">${measures}</div>
                                    </div>
                                    <hr>
                                    <div class="info-section">
                                        <h3 class="info-header"><i class="fas fa-search"></i>根本原因</h3>
                                        <div class="info-content">${rootCause}</div>
                                    </div>
                                    <hr>
                                    <div class="info-section">
                                        <h3 class="info-header"><i class="fas fa-lightbulb"></i>维修建议</h3>
                                        <div class="info-content">
                                            <ul>
                                                <li>执行维修措施前，请先确认故障现象是否一致</li>
                                                <li>处理高压部件时，请确保设备已断电且压力释放</li>
                                                <li>更换部件后需进行功能测试</li>
                                                <li>如维修后问题仍存在，请升级报告</li>
                                            </ul>
                                        </div>
                                    </div>
                                `;
                            }
                        }
                    });
                });
                
                // 搜索功能
                searchInput.addEventListener('input', function() {
                    const searchTerm = this.value.toLowerCase().trim();
                    let found = false;
                    
                    noResults.style.display = 'none';
                    
                    if (!searchTerm) {
                        nodes.forEach(node => {
                            node.closest('li').style.display = 'list-item';
                            node.closest('ul').style.display = 'block';
                        });
                        return;
                    }
                    
                    nodes.forEach(node => {
                        const nodeText = node.querySelector('.node-text').textContent.toLowerCase();
                        const li = node.closest('li');
                        
                        if (nodeText.includes(searchTerm)) {
                            li.style.display = 'list-item';
                            
                            // 展开父节点
                            let parentLi = li.parentNode.closest('li');
                            while (parentLi) {
                                parentLi.style.display = 'list-item';
                                const parentNode = parentLi.querySelector('.node');
                                const parentIcon = parentNode.querySelector('.fa-folder, .fa-folder-open');
                                const childList = parentNode.nextElementSibling;
                                
                                if (childList && childList.tagName === 'UL') {
                                    childList.style.display = 'block';
                                    if (parentIcon) {
                                        parentIcon.classList.remove('fa-folder');
                                        parentIcon.classList.add('fa-folder-open');
                                    }
                                }
                                
                                parentLi = parentLi.parentNode.closest('li');
                            }
                            found = true;
                        } else {
                            li.style.display = 'none';
                        }
                    });
                    
                    if (!found) {
                        noResults.style.display = 'block';
                    }
                });
            }
        });