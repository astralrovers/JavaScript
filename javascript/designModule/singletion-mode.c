#include <stdio.h>

// static char admin_name[20] = "admin";

// static void set_admin_name(char *name) {
//     sprintf(admin_name, "%s", name);
// }

// static char *get_admin_name(void) {
//     return admin_name;
// }

// int main(int args, char** argv) {
//     set_admin_name("javascript");
//     printf("%s\n", get_admin_name());
//     return 0;
// }

#include <stdio.h>
#include <stdbool.h>
#include <stdlib.h>

static char *create_admin(char *name) {
    static bool is_created = false;
    static char *admin = NULL;
    if (!is_created) {
        admin = (char *)malloc(20);
        sprintf(admin, "%s", name);
        is_created = true;
    }
    return admin;
}

int main(int argc, char** argv) {
    char *admin1 = create_admin("javascript");
    char *admin2 = create_admin("c language");
    printf("%s\n", (admin1 == admin2) ? "true" : "false");
    printf("admin1 %s\n", admin1);
    printf("admin2 %s\n", admin2);
    return 0;
}
