const categories = [
    {
        name: 'Mathematics',
        subcategories: [
            {
                name: 'Algebra',
                subsubcategories: ['Linear Equations', 'Quadratic Equations', 'Polynomials']
            },
            {
                name: 'Geometry',
                subsubcategories: ['Shapes', 'Angles', 'Trigonometry']
            }
        ]
    },
    {
        name: 'Science',
        subcategories: [
            {
                name: 'Biology',
                subsubcategories: ['Cell Structure', 'Genetics', 'Ecology']
            },
            {
                name: 'Chemistry',
                subsubcategories: ['Atoms', 'Chemical Reactions', 'Periodic Table']
            }
        ]
    }
];

let selectedCategories = flattenCategories(categories);

function flattenCategories(categories, parentPath = []) {
    return categories.reduce((acc, category) => {
        const currentPath = [...parentPath, category.name];
        acc[currentPath.join('.')] = false;
        if (category.subcategories) {
            Object.assign(acc, flattenCategories(category.subcategories, currentPath));
        }
        if (category.subsubcategories) {
            category.subsubcategories.forEach(subsubcat => {
                acc[`${currentPath.join('.')}.${subsubcat}`] = false;
            });
        }
        return acc;
    }, {});
}

function createCategoryItem(item, path = []) {
    const currentPath = path.concat(item.name).join('.');
    const hasChildren = item.subcategories || item.subsubcategories;

    const container = document.createElement('div');

    const label = document.createElement('label');
    label.innerHTML = `
        <input type="checkbox" ${selectedCategories[currentPath] ? 'checked' : ''} />
        <span>${item.name}</span>
    `;
    label.querySelector('input').addEventListener('change', () => toggleCategory(currentPath));
    container.appendChild(label);

    if (hasChildren) {
        const button = document.createElement('button');
        button.textContent = '+';
        button.style.marginRight = '8px';
        button.addEventListener('click', () => {
            const expanded = button.textContent === '-';
            button.textContent = expanded ? '+' : '-';
            childContainer.style.display = expanded ? 'none' : 'block';
        });
        container.insertBefore(button, label);

        const childContainer = document.createElement('div');
        childContainer.style.display = 'none';

        if (item.subcategories) {
            item.subcategories.forEach(subcat => {
                childContainer.appendChild(createCategoryItem(subcat, path.concat(item.name)));
            });
        }

        if (item.subsubcategories) {
            item.subsubcategories.forEach(subsubcat => {
                childContainer.appendChild(createCategoryItem({ name: subsubcat }, path.concat(item.name)));
            });
        }

        container.appendChild(childContainer);
    }

    return container;
}

function renderCategories() {
    const categoryContainer = document.getElementById('category-container');
    categoryContainer.innerHTML = '';
    categories.forEach(category => {
        categoryContainer.appendChild(createCategoryItem(category));
    });
}

function toggleCategory(path) {
    selectedCategories[path] = !selectedCategories[path];

    if (selectedCategories[path]) {
        const parts = path.split('.');
        while (parts.length > 1) {
            parts.pop();
            const parentPath = parts.join('.');
            selectedCategories[parentPath] = true;
        }
    }

    Object.keys(selectedCategories).forEach(key => {
        if (key.startsWith(path + '.')) {
            selectedCategories[key] = selectedCategories[path];
        }
    });

    renderSelectedCategories();
}

function renderSelectedCategories() {
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = '';
    const selections = getLowestLevelSelections();
    selections.forEach(path => {
        const li = document.createElement('li');
        li.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>${path.split('.').join(' > ')}`;
        selectedList.appendChild(li);
    });
}

function getLowestLevelSelections() {
    const selections = Object.entries(selectedCategories)
        .filter(([_, isSelected]) => isSelected)
        .map(([path]) => path);

    return selections.filter(path =>
        !selections.some(otherPath =>
            otherPath !== path && otherPath.startsWith(path + '.')
        )
    );
}

function handleDone() {
    const lowestLevelSelections = getLowestLevelSelections();
    document.cookie = `categories=${JSON.stringify(lowestLevelSelections)}; expires=${new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
    window.location.href = 'https://joe.ackop.com';
}

document.getElementById('done-button').addEventListener('click', handleDone);

renderCategories();
renderSelectedCategories();
