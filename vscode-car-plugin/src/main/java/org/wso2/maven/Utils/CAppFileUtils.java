/*
Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

package org.wso2.maven.Utils;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class CAppFileUtils {
    /*
     * Copies src file to dst file.
     * If the dst file does not exist, it is created.
     * */
    public static void copy(File src, File dst) throws IOException {
        if (dst.getParentFile() != null && !dst.getParentFile().exists()) {
            dst.getParentFile().mkdirs();
        }
        InputStream in = new FileInputStream(src);
        OutputStream out = new FileOutputStream(dst);

        // Transfer bytes from in to out
        byte[] buf = new byte[1024];
        int len;
        while ((len = in.read(buf)) > 0) {
            out.write(buf, 0, len);
        }
        in.close();
        out.close();
    }

    public static boolean createDirectory(String directory) {
        // Create a directory; all ancestor directories must exist
        return (new File(directory)).mkdir();
    }

    public static boolean createDirectories(String directory) {
        // Create a directory; all ancestor directories must exist
        return (new File(directory)).mkdirs();
    }

    public static void createFile(File destinationFile, String content) throws IOException {
        //Create parent folder if it doesn't exist
        if (!(destinationFile.getParentFile() == null || destinationFile.getParentFile().exists())) {
            destinationFile.getParentFile().mkdirs();
        }

        InputStream dataStream = new ByteArrayInputStream(content.getBytes());
        createFile(destinationFile, dataStream);
    }

    private static void createFile(File destinationFile, InputStream dataStream)
            throws IOException {
        FileOutputStream out = new FileOutputStream(destinationFile);
        createFile(dataStream, out);
    }

    private static void createFile(InputStream dataStream, OutputStream out)
            throws IOException {
        byte[] data = new byte[1024];
        int readLength;
        while ((readLength = dataStream.read(data)) > 0) {
            out.write(data, 0, readLength);
        }

        //Close input stream
        dataStream.close();

        //Close the output stream
        out.close();
    }
}
