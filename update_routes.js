const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/behru/OneDrive/Desktop/kundalik/front/src/Components/';
const files = [
    'AT/ATRoute.jsx',
    'Admin/AdminRoute.jsx',
    'Boss/BossRoute.jsx',
    'Complex/ComplexRoute.jsx',
    'Department/DepartmentRoute.jsx',
    'Employee/EmployeeRoute.jsx',
    'Hr/HrRoute.jsx',
    'Komissiya/KomissiyaRoute.jsx',
    'Lang/LangRoute.jsx',
    'Sport/SportRoute.jsx',
    'Staff/StaffRoute.jsx',
    'SuperAdmin/SuperAdminRoute.jsx'
];

files.forEach(file => {
    let filePath = path.join(dir, file);
    if(fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;
        
        // Add import if not exists
        if (!content.includes("import Security from '../Security/Security';")) {
            // Find last import
            const lastImportIndex = content.lastIndexOf("import ");
            if (lastImportIndex !== -1) {
                const endOfLine = content.indexOf('\n', lastImportIndex);
                content = content.slice(0, endOfLine + 1) + "import Security from '../Security/Security';\n" + content.slice(endOfLine + 1);
                modified = true;
            }
        }

        // Add Route
        if (!content.includes('<Route path="/profile/security"')) {
            // Replace right before the catch-all wildcard or the end of routes
            if (content.includes('<Route path="/*"')) {
                content = content.replace(
                    /<Route path="\/\*"(.*?)>/,
                    '<Route path="/profile/security" exact element={<Security />} />\n              <Route path="/*"$1>'
                );
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`Updated: ${file}`);
        }
    }
});
