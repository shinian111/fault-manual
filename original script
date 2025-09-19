document.addEventListener('DOMContentLoaded', function() {

            // 初始化：折叠所有文件夹节点

            const allFolders = document.querySelectorAll('.node > .fa-folder-open');

            allFolders.forEach(icon => {

                icon.classList.remove('fa-folder-open');

                icon.classList.add('fa-folder');

            });

           

            // 移除所有节点的active类

            const allNodes = document.querySelectorAll('.node');

            allNodes.forEach(node => {

                node.classList.remove('active');

            });

           

            // 隐藏所有子节点

            const allChildUl = document.querySelectorAll('.tree > li > ul, .tree ul ul');

            allChildUl.forEach(ul => {

                ul.style.display = 'none';

            });

           

            // 节点元素

            const nodes = document.querySelectorAll('.node');

            // 信息展示区

            const infoDisplay = document.querySelector('.info-display');

           

            // 添加点击事件到所有节点

            nodes.forEach(node => {

                node.addEventListener('click', function(e) {

                    // 阻止事件冒泡，避免触发父节点事件

                    e.stopPropagation();

                   

                    // 移除所有节点的active类

                    nodes.forEach(n => n.classList.remove('active'));

                   

                    // 为当前节点添加active类

                    this.classList.add('active');

                   

                    // 处理文件夹展开/折叠

                    if (this.querySelector('.fa-folder, .fa-folder-open')) {

                        const icon = this.querySelector('.fa-folder, .fa-folder-open');

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

                   

                    // 获取节点名称、措施和根本原因

                    const measures = this.getAttribute('data-measures');

                    const rootCause = this.getAttribute('data-root-cause');

                   

                    // 如果节点有措施数据，更新信息展示区域

                    if (measures && rootCause) {

                        // 将文本中的换行符转换为HTML换行

                        const formattedMeasures = measures.replace(/\n/g, '<br>');

                       

                     

                        infoDisplay.innerHTML = `

                            <div class="info-section">

                                <h3 class="info-header"><i class="fas fa-tools"></i>维修措施</h3>

                                <div class="info-content">

                                    ${formattedMeasures}

                                </div>

                            </div>

                            <hr>

                            <div class="info-section">

                                <h3 class="info-header"><i class="fas fa-search"></i>根本原因</h3>

                                <div class="info-content">

                                    ${rootCause}

                                </div>

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

                });

            });

            // 搜索功能

            const searchInput = document.getElementById('searchInput');

            const noResults = document.querySelector('.no-results');

           

            searchInput.addEventListener('input', function() {

                const searchTerm = this.value.toLowerCase().trim();

                let found = false;

               

                // 隐藏"未找到结果"消息

                noResults.style.display = 'none';

               

                // 如果没有搜索词，重置所有节点

                if (!searchTerm) {

                    nodes.forEach(node => {

                        node.closest('li').style.display = 'list-item';

                        node.closest('ul').style.display = 'block';

                    });

                    return;

                }

               

                // 遍历所有节点

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

                                parentIcon.classList.remove('fa-folder');

                                parentIcon.classList.add('fa-folder-open');

                            }

                           

                            parentLi = parentLi.parentNode.closest('li');

                        }

                        found = true;

                    } else {

                        li.style.display = 'none';

                    }

                });

               

                // 如果没有找到匹配项

                if (!found) {

                    noResults.style.display = 'block';

                }

            });

        });
