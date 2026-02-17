#!/bin/bash

# Exit on error
set -e

# Base directory
BASE_DIR="/Applications/careercopilot/dist"
FIXED_DIR="${BASE_DIR}/skills-fixed"
TMP_DIR="/tmp/skills_fix"

# Create temp directory
mkdir -p "${TMP_DIR}"

# Function to process a directory
process_skill_dir() {
    local dir=$1
    echo "Processing directory: ${dir}"
    
    # Process each .skill file
    for skill_file in "${dir}"/*.skill; do
        if [ -f "${skill_file}" ]; then
            local base_name=$(basename "${skill_file}" .skill)
            local zip_file="${dir}/${base_name}.zip"
            echo "  Converting ${skill_file} to ${zip_file}"
            
            # Create a temporary directory for the skill
            local temp_skill_dir="${TMP_DIR}/${base_name}"
            rm -rf "${temp_skill_dir}"
            mkdir -p "${temp_skill_dir}"
            
            # Extract the .skill file (which is just a zip file)
            unzip -q "${skill_file}" -d "${temp_skill_dir}" || {
                echo "    Warning: Failed to extract ${skill_file}, creating minimal structure"
                # Create minimal structure
                mkdir -p "${temp_skill_dir}/src"
                touch "${temp_skill_dir}/SKILL.md"
                echo "{\n  \"name\": \"${base_name}\",\n  \"version\": \"1.0.0\"\n}" > "${temp_skill_dir}/package.json"
            }
            
            # Create a new zip file with the proper structure
            (cd "${temp_skill_dir}" && zip -qr "${zip_file}" .)
            
            # Clean up
            rm -f "${skill_file}"
        fi
    done
    
    # Process each .zip file to ensure proper structure
    for zip_file in "${dir}"/*.zip; do
        if [ -f "${zip_file}" ]; then
            echo "  Validating ${zip_file}"
            local base_name=$(basename "${zip_file}" .zip)
            local temp_skill_dir="${TMP_DIR}/validate_${base_name}"
            
            # Clean up any existing temp directory
            rm -rf "${temp_skill_dir}"
            mkdir -p "${temp_skill_dir}"
            
            # Extract the zip file
            if ! unzip -q "${zip_file}" -d "${temp_skill_dir}" 2>/dev/null; then
                echo "    Warning: ${zip_file} is corrupted or empty, recreating..."
                # Create minimal structure
                rm -rf "${temp_skill_dir}"
                mkdir -p "${temp_skill_dir}/src"
                touch "${temp_skill_dir}/SKILL.md"
                echo "{\n  \"name\": \"${base_name}\",\n  \"version\": \"1.0.0\"\n}" > "${temp_skill_dir}/package.json"
                
                # Recreate the zip file
                rm -f "${zip_file}"
                (cd "${temp_skill_dir}" && zip -qr "${zip_file}" .)
                continue
            fi
            
            # Check for required files
            local needs_update=0
            if [ ! -f "${temp_skill_dir}/SKILL.md" ]; then
                echo "    Adding missing SKILL.md"
                touch "${temp_skill_dir}/SKILL.md"
                needs_update=1
            fi
            
            if [ ! -f "${temp_skill_dir}/package.json" ]; then
                echo "    Adding missing package.json"
                echo "{\n  \"name\": \"${base_name}\",\n  \"version\": \"1.0.0\"\n}" > "${temp_skill_dir}/package.json"
                needs_update=1
            fi
            
            # If we made changes, update the zip file
            if [ ${needs_update} -eq 1 ]; then
                echo "    Updating ${zip_file}"
                rm -f "${zip_file}"
                (cd "${temp_skill_dir}" && zip -qr "${zip_file}" .)
            fi
            
            # Clean up
            rm -rf "${temp_skill_dir}"
        fi
    done
}

# Process each directory
for dir in "${BASE_DIR}/skills-design" "${BASE_DIR}/skills-m3"; do
    if [ -d "${dir}" ]; then
        process_skill_dir "${dir}"
    else
        echo "Warning: Directory ${dir} does not exist, skipping..."
    fi
done

# Clean up
echo "Cleaning up..."
rm -rf "${TMP_DIR}"

echo "Done!"
